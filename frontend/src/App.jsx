import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [loginMode, setLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadVehicles = async () => {
    try {
      const response = await fetch(`${API}/vehicles`);
      const data = await response.json();

      if (response.ok) {
        setVehicles(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend. Make sure backend is running.");
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const submitAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = loginMode ? "login" : "register";

      const response = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (loginMode) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
      } else {
        alert("Registration successful. Please login.");

        setLoginMode(true);
        setAuth({
          name: "",
          email: auth.email,
          password: "",
          role: "user",
        });
      }
    } catch (error) {
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const purchase = async (id) => {
    try {
      const response = await fetch(`${API}/vehicles/${id}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Purchase failed");
        return;
      }

      alert("Vehicle purchased successfully!");
      loadVehicles();
    } catch (error) {
      alert("Purchase failed.");
    }
  };

  const saveVehicle = async (e) => {
    e.preventDefault();

    if (!vehicle.make || !vehicle.model || !vehicle.category) {
      alert("Please fill all vehicle details.");
      return;
    }

    try {
      const url = editingId
        ? `${API}/vehicles/${editingId}`
        : `${API}/vehicles`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...vehicle,
          price: Number(vehicle.price),
          quantity: Number(vehicle.quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Operation failed");
        return;
      }

      alert(editingId ? "Vehicle updated!" : "Vehicle added!");

      resetVehicleForm();
      loadVehicles();
    } catch (error) {
      alert("Operation failed.");
    }
  };

  const editVehicle = (v) => {
    setEditingId(v._id);

    setVehicle({
      make: v.make,
      model: v.model,
      category: v.category,
      price: v.price,
      quantity: v.quantity,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetVehicleForm = () => {
    setEditingId(null);

    setVehicle({
      make: "",
      model: "",
      category: "",
      price: "",
      quantity: "",
    });
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Vehicle deleted.");
      loadVehicles();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const filteredVehicles = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center text-white mb-8">
            <div className="text-6xl mb-3">🚗</div>
            <h1 className="text-4xl font-extrabold">CarVault</h1>
            <p className="text-slate-300 mt-2">
              Car Dealership Inventory System
            </p>
          </div>

          <form
            onSubmit={submitAuth}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {loginMode ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-gray-500 mb-6">
              {loginMode
                ? "Login to manage your vehicle inventory."
                : "Register to access the dealership system."}
            </p>

            {!loginMode && (
              <>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  className="w-full border border-gray-300 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  value={auth.name}
                  onChange={(e) =>
                    setAuth({ ...auth, name: e.target.value })
                  }
                  required
                />
              </>
            )}

            <label className="block text-sm font-semibold mb-2">
              Email
            </label>

            <input
              className="w-full border border-gray-300 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              type="email"
              value={auth.email}
              onChange={(e) =>
                setAuth({ ...auth, email: e.target.value })
              }
              required
            />

            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <input
              className="w-full border border-gray-300 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              type="password"
              value={auth.password}
              onChange={(e) =>
                setAuth({ ...auth, password: e.target.value })
              }
              required
            />

            {!loginMode && (
              <>
                <label className="block text-sm font-semibold mb-2">
                  Account Type
                </label>

                <select
                  className="w-full border border-gray-300 p-3 rounded-xl mb-5"
                  value={auth.role}
                  onChange={(e) =>
                    setAuth({ ...auth, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl font-bold transition"
            >
              {loading
                ? "Please wait..."
                : loginMode
                ? "Login"
                : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setLoginMode(!loginMode)}
              className="w-full mt-5 text-blue-600 font-semibold hover:underline"
            >
              {loginMode
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <nav className="bg-slate-950 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">🚗 CarVault</h1>
            <p className="text-slate-400 text-sm">
              Dealership Inventory Management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full uppercase">
                {user?.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Vehicle Inventory
          </h2>

          <p className="text-gray-500 mt-1">
            Browse, search and manage dealership vehicles.
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <input
            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="🔍 Search by make, model or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADMIN PANEL */}
        {user?.role === "admin" && (
          <form
            onSubmit={saveVehicle}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "✏️ Update Vehicle" : "➕ Add Vehicle"}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingId
                    ? "Modify the selected vehicle."
                    : "Add a new vehicle to inventory."}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetVehicleForm}
                  className="text-gray-500 hover:text-red-500 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-5 gap-3">
              {["make", "model", "category"].map((field) => (
                <input
                  key={field}
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={vehicle[field]}
                  onChange={(e) =>
                    setVehicle({
                      ...vehicle,
                      [field]: e.target.value,
                    })
                  }
                  required
                />
              ))}

              <input
                className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Price"
                type="number"
                min="0"
                value={vehicle.price}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    price: e.target.value,
                  })
                }
                required
              />

              <input
                className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Quantity"
                type="number"
                min="0"
                value={vehicle.quantity}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    quantity: e.target.value,
                  })
                }
                required
              />
            </div>

            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">
              {editingId ? "Update Vehicle" : "Add Vehicle"}
            </button>
          </form>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Vehicles</p>
            <p className="text-3xl font-bold text-slate-900">
              {vehicles.length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Available</p>
            <p className="text-3xl font-bold text-green-600">
              {vehicles.filter((v) => v.quantity > 0).length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="text-3xl font-bold text-red-500">
              {vehicles.filter((v) => v.quantity === 0).length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Showing</p>
            <p className="text-3xl font-bold text-blue-600">
              {filteredVehicles.length}
            </p>
          </div>
        </div>

        {/* VEHICLES */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🚘</div>
            <h3 className="text-xl font-bold">No vehicles found</h3>
            <p className="text-gray-500 mt-2">
              Try another search.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((v) => (
              <div
                key={v._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
              >
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-center">
                  <div className="text-7xl">🚘</div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {v.make} {v.model}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {v.category}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        v.quantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {v.quantity > 0 ? "AVAILABLE" : "SOLD OUT"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-gray-500 text-sm">Price</p>

                    <p className="text-2xl font-extrabold text-slate-900">
                      ₹{Number(v.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="mt-3 text-gray-600">
                    Stock:{" "}
                    <span className="font-bold text-slate-900">
                      {v.quantity}
                    </span>
                  </div>

                  <button
                    disabled={v.quantity === 0}
                    onClick={() => purchase(v._id)}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl font-bold transition"
                  >
                    {v.quantity === 0 ? "Out of Stock" : "Purchase Vehicle"}
                  </button>

                  {user?.role === "admin" && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => editVehicle(v)}
                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteVehicle(v._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 py-8">
        <p>© 2026 CarVault — Car Dealership Inventory System</p>
      </footer>
    </div>
  );
}

export default App;