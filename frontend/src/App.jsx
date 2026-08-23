import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [loginMode, setLoginMode] = useState(true);

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [search, setSearch] = useState("");

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: "",
  });

  const loadVehicles = async () => {
    const response = await fetch(`${API}/vehicles`);
    const data = await response.json();
    setVehicles(data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const submitAuth = async (e) => {
    e.preventDefault();

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
      alert(data.message);
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
    }
  };

  const purchase = async (id) => {
    const response = await fetch(`${API}/vehicles/${id}/purchase`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    loadVehicles();
    alert("Vehicle purchased successfully!");
  };

  const addVehicle = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API}/vehicles`, {
      method: "POST",
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
      alert(data.message);
      return;
    }

    setVehicle({
      make: "",
      model: "",
      category: "",
      price: "",
      quantity: "",
    });

    loadVehicles();
  };

  const deleteVehicle = async (id) => {
    const response = await fetch(`${API}/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    loadVehicles();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <form
          onSubmit={submitAuth}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            CarVault
          </h1>

          <p className="text-gray-500 mb-6">
            Car Dealership Inventory System
          </p>

          {!loginMode && (
            <input
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Name"
              value={auth.name}
              onChange={(e) =>
                setAuth({ ...auth, name: e.target.value })
              }
            />
          )}

          <input
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="Email"
            type="email"
            value={auth.email}
            onChange={(e) =>
              setAuth({ ...auth, email: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Password"
            type="password"
            value={auth.password}
            onChange={(e) =>
              setAuth({ ...auth, password: e.target.value })
            }
          />

          {!loginMode && (
            <select
              className="w-full border p-3 rounded-lg mb-4"
              value={auth.role}
              onChange={(e) =>
                setAuth({ ...auth, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold">
            {loginMode ? "Login" : "Register"}
          </button>

          <button
            type="button"
            onClick={() => setLoginMode(!loginMode)}
            className="w-full mt-4 text-blue-600"
          >
            {loginMode
              ? "Create an account"
              : "Already have an account? Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">🚗 CarVault</h1>
          <p className="text-sm text-gray-300">
            Inventory Management System
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {user?.name} ({user?.role})
          </span>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <input
            className="w-full p-4 rounded-xl border"
            placeholder="Search by make, model or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {user?.role === "admin" && (
          <form
            onSubmit={addVehicle}
            className="bg-white p-6 rounded-xl shadow mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              Add Vehicle
            </h2>

            <div className="grid md:grid-cols-5 gap-3">
              {["make", "model", "category", "price", "quantity"].map(
                (field) => (
                  <input
                    key={field}
                    className="border p-3 rounded-lg"
                    placeholder={field}
                    type={
                      field === "price" || field === "quantity"
                        ? "number"
                        : "text"
                    }
                    value={vehicle[field]}
                    onChange={(e) =>
                      setVehicle({
                        ...vehicle,
                        [field]: e.target.value,
                      })
                    }
                  />
                )
              )}
            </div>

            <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg">
              Add Vehicle
            </button>
          </form>
        )}

        <h2 className="text-2xl font-bold mb-4">
          Available Vehicles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="text-4xl mb-4">🚘</div>

              <h3 className="text-xl font-bold">
                {v.make} {v.model}
              </h3>

              <p className="text-gray-500">{v.category}</p>

              <p className="text-2xl font-bold mt-4">
                ₹{v.price.toLocaleString()}
              </p>

              <p className="mt-2">
                Stock: <b>{v.quantity}</b>
              </p>

              <button
                disabled={v.quantity === 0}
                onClick={() => purchase(v._id)}
                className="w-full mt-4 bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg"
              >
                {v.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>

              {user?.role === "admin" && (
                <button
                  onClick={() => deleteVehicle(v._id)}
                  className="w-full mt-2 bg-red-500 text-white p-3 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;