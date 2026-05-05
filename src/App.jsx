import { useEffect, useMemo, useState } from "react";

const defaultProducts = [
  {
    id: 51487,
    name: "Mouse óptico",
    category: "Accesorios",
    price: 150,
    stock: 0,
    createdAt: "4/5/2026",
  },
  {
    id: 31769,
    name: "Cable Ethernet",
    category: "Redes",
    price: 80,
    stock: 4,
    createdAt: "4/5/2026",
  },
  {
    id: 17198,
    name: "Teclado inalámbrico",
    category: "Accesorios",
    price: 450,
    stock: 12,
    createdAt: "4/5/2026",
  },
];

const initialForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
};

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory-products");
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");

  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  const getProductStatus = (stock) => {
    const quantity = Number(stock);

    if (quantity === 0) return "Agotado";
    if (quantity <= 5) return "Bajo stock";
    return "Disponible";
  };

  const getStatusClass = (status) => {
    if (status === "Agotado") return "status status-danger";
    if (status === "Bajo stock") return "status status-warning";
    return "status status-success";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      form.stock === ""
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (Number(form.price) <= 0) {
      alert("El precio debe ser mayor a 0.");
      return;
    }

    if (Number(form.stock) < 0) {
      alert("La existencia no puede ser negativa.");
      return;
    }

    if (editingId) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: form.name.trim(),
              category: form.category.trim(),
              price: Number(form.price),
              stock: Number(form.stock),
            }
          : product
      );

      setProducts(updatedProducts);
      resetForm();
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      createdAt: new Date().toLocaleDateString("es-MX"),
    };

    setProducts((prev) => [newProduct, ...prev]);
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmed) return;

    setProducts((prev) => prev.filter((product) => product.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const status = getProductStatus(product.stock);
      const text = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "Todos los estados" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalProducts = products.length;
  const availableProducts = products.filter(
    (product) => getProductStatus(product.stock) === "Disponible"
  ).length;
  const lowStockProducts = products.filter(
    (product) => getProductStatus(product.stock) === "Bajo stock"
  ).length;
  const outOfStockProducts = products.filter(
    (product) => getProductStatus(product.stock) === "Agotado"
  ).length;

  return (
    <div className="inventory-app">
      <div className="inventory-container">
        <header className="hero">
          <div className="hero-left">
            <span className="hero-label">Panel de almacén</span>
            <h1>Gestión de inventario</h1>
            <p>
              Administra productos, existencias y movimientos de forma visual y
              ordenada.
            </p>
          </div>

          <div className="hero-badge">
            <span>Sistema activo</span>
            <strong>Inventario interno</strong>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card stat-total">
            <p className="stat-title">Productos registrados</p>
            <h2>{totalProducts}</h2>
            <span>Control general del inventario</span>
          </article>

          <article className="stat-card stat-success">
            <p className="stat-title">Disponibles</p>
            <h2>{availableProducts}</h2>
            <span>Productos con stock suficiente</span>
          </article>

          <article className="stat-card stat-warning">
            <p className="stat-title">Bajo stock</p>
            <h2>{lowStockProducts}</h2>
            <span>Requieren atención pronta</span>
          </article>

          <article className="stat-card stat-danger">
            <p className="stat-title">Agotados</p>
            <h2>{outOfStockProducts}</h2>
            <span>Sin existencias en almacén</span>
          </article>
        </section>

        <section className="main-grid">
          <div className="panel form-panel">
            <div className="panel-header">
              <h3>{editingId ? "Editar producto" : "Registrar producto"}</h3>
              <p>
                {editingId
                  ? "Modifica la información del producto seleccionado."
                  : "Agrega nuevos artículos al inventario."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Nombre del producto</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Monitor LED"
                />
              </div>

              <div className="field">
                <label>Categoría</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Redes">Redes</option>
                  <option value="Cómputo">Cómputo</option>
                  <option value="Papelería">Papelería</option>
                  <option value="Periféricos">Periféricos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="row-fields">
                <div className="field">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Ej. 450"
                    min="1"
                  />
                </div>

                <div className="field">
                  <label>Existencia</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Ej. 10"
                    min="0"
                  />
                </div>
              </div>

              <button className="btn-save" type="submit">
                {editingId ? "Guardar cambios" : "Guardar producto"}
              </button>

              {editingId && (
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={resetForm}
                >
                  Cancelar edición
                </button>
              )}
            </form>

            <div className="tip-box">
              <h4>Tip de control</h4>
              <p>
                Mantén actualizado el stock para detectar productos agotados o
                próximos a terminarse.
              </p>
            </div>
          </div>

          <div className="panel table-panel">
            <div className="panel-header">
              <h3>Inventario actual</h3>
              <p>Consulta, filtra y administra los productos registrados.</p>
            </div>

            <div className="toolbar">
              <input
                type="text"
                placeholder="Buscar por nombre o categoría"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Todos los estados</option>
                <option>Disponible</option>
                <option>Bajo stock</option>
                <option>Agotado</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <strong>No hay productos para mostrar</strong>
                <p>Registra un producto o modifica los filtros de búsqueda.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Clave</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => {
                      const status = getProductStatus(product.stock);

                      return (
                        <tr key={product.id}>
                          <td>#{String(product.id).slice(-5)}</td>
                          <td className="product-name">{product.name}</td>
                          <td>{product.category}</td>
                          <td>${Number(product.price).toFixed(2)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span className={getStatusClass(status)}>
                              {status}
                            </span>
                          </td>
                          <td>{product.createdAt}</td>
                          <td>
                            <div className="actions">
                              <button
                                type="button"
                                className="btn-edit"
                                onClick={() => handleEdit(product)}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="btn-delete"
                                onClick={() => handleDelete(product.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;