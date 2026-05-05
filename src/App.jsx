import "./index.css";

function App() {
  const stats = {
    total: 3,
    available: 1,
    lowStock: 1,
    outOfStock: 1,
  };

  const products = [
    {
      id: 51487,
      name: "Mouse óptico",
      category: "Accesorios",
      price: 150,
      stock: 0,
      date: "4/5/2026",
    },
    {
      id: 31769,
      name: "Cable Ethernet",
      category: "Redes",
      price: 80,
      stock: 4,
      date: "4/5/2026",
    },
    {
      id: 17198,
      name: "Teclado inalámbrico",
      category: "Accesorios",
      price: 450,
      stock: 12,
      date: "4/5/2026",
    },
  ];

  const getStatus = (stock) => {
    if (stock === 0) return "Agotado";
    if (stock <= 5) return "Bajo stock";
    return "Disponible";
  };

  const getStatusClass = (stock) => {
    if (stock === 0) return "status status-danger";
    if (stock <= 5) return "status status-warning";
    return "status status-success";
  };

  return (
    <div className="inventory-app">
      <header className="hero">
        <div>
          <p className="hero-label">Panel de almacén</p>
          <h1>Gestión de inventario</h1>
          <p className="hero-text">
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
          <span className="stat-title">Productos registrados</span>
          <h2>{stats.total}</h2>
          <p>Control general del inventario</p>
        </article>

        <article className="stat-card stat-success">
          <span className="stat-title">Disponibles</span>
          <h2>{stats.available}</h2>
          <p>Productos con stock suficiente</p>
        </article>

        <article className="stat-card stat-warning">
          <span className="stat-title">Bajo stock</span>
          <h2>{stats.lowStock}</h2>
          <p>Requieren atención pronta</p>
        </article>

        <article className="stat-card stat-danger">
          <span className="stat-title">Agotados</span>
          <h2>{stats.outOfStock}</h2>
          <p>Sin existencias en almacén</p>
        </article>
      </section>

      <main className="content-grid">
        <aside className="panel form-panel">
          <div className="panel-header">
            <h3>Registrar producto</h3>
            <p>Agrega nuevos artículos al inventario.</p>
          </div>

          <form className="product-form">
            <div className="field">
              <label>Nombre del producto</label>
              <input type="text" placeholder="Ej. Monitor LED" />
            </div>

            <div className="field">
              <label>Categoría</label>
              <select>
                <option>Selecciona una categoría</option>
                <option>Accesorios</option>
                <option>Redes</option>
                <option>Periféricos</option>
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Precio</label>
                <input type="number" placeholder="Ej. 450" />
              </div>

              <div className="field">
                <label>Existencia</label>
                <input type="number" placeholder="Ej. 10" />
              </div>
            </div>

            <button type="button" className="btn btn-primary full">
              Guardar producto
            </button>
          </form>

          <div className="mini-box">
            <h4>Tip de control</h4>
            <p>
              Mantén actualizado el stock para detectar productos agotados o
              próximos a terminarse.
            </p>
          </div>
        </aside>

        <section className="panel table-panel">
          <div className="panel-header">
            <h3>Inventario actual</h3>
            <p>Consulta, filtra y administra los productos registrados.</p>
          </div>

          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o categoría"
            />

            <select className="filter-select">
              <option>Todos los estados</option>
              <option>Disponible</option>
              <option>Bajo stock</option>
              <option>Agotado</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table className="inventory-table">
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
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}.00</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={getStatusClass(product.stock)}>
                        {getStatus(product.stock)}
                      </span>
                    </td>
                    <td>{product.date}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-edit">Editar</button>
                        <button className="btn btn-delete">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;