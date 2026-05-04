import { useEffect, useMemo, useState } from 'react';
import './index.css';

const initialForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
};

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
  }, [products]);

  const getProductStatus = (stock) => {
    const quantity = Number(stock);

    if (quantity === 0) return 'Agotado';
    if (quantity <= 5) return 'Bajo stock';
    return 'Disponible';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !form.price || !form.stock) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (Number(form.price) <= 0 || Number(form.stock) < 0) {
      alert('El precio debe ser mayor a 0 y la existencia no puede ser negativa.');
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
              status: getProductStatus(form.stock),
            }
          : product
      );

      setProducts(updatedProducts);
      setEditingId(null);
      setForm(initialForm);
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      status: getProductStatus(form.stock),
      createdAt: new Date().toLocaleDateString('es-MX'),
    };

    setProducts([newProduct, ...products]);
    setForm(initialForm);
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

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const deleteProduct = (productId) => {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este producto?');

    if (!confirmDelete) return;

    const filteredProducts = products.filter((product) => product.id !== productId);
    setProducts(filteredProducts);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'Todos' || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalProducts = products.length;
  const availableProducts = products.filter((product) => product.status === 'Disponible').length;
  const lowStockProducts = products.filter((product) => product.status === 'Bajo stock').length;
  const outOfStockProducts = products.filter((product) => product.status === 'Agotado').length;

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <span className="system-label">Inventario interno</span>
          <h1>Control de productos</h1>
        </div>

        <div className="topbar-info">
          <span>Panel administrativo</span>
          <strong>Almacén</strong>
        </div>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Resumen del inventario</h2>
            <p>Control básico de productos, existencias y estado del stock.</p>
          </div>

          <div className="summary-list">
            <div>
              <span>Total</span>
              <strong>{totalProducts}</strong>
            </div>

            <div>
              <span>Disponibles</span>
              <strong>{availableProducts}</strong>
            </div>

            <div>
              <span>Bajo stock</span>
              <strong>{lowStockProducts}</strong>
            </div>

            <div>
              <span>Agotados</span>
              <strong>{outOfStockProducts}</strong>
            </div>
          </div>

          <div className="note-box">
            <strong>Objetivo</strong>
            <p>
              Registrar productos, controlar existencias y detectar artículos con bajo stock.
            </p>
          </div>
        </aside>

        <section className="main-content">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
                <p>Captura la información principal del producto.</p>
              </div>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              <label>
                Nombre del producto
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Teclado inalámbrico"
                />
              </label>

              <label>
                Categoría
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Selecciona una categoría</option>
                  <option value="Computo">Cómputo</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Papeleria">Papelería</option>
                  <option value="Redes">Redes</option>
                  <option value="Otros">Otros</option>
                </select>
              </label>

              <label>
                Precio
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej. 450"
                  min="1"
                />
              </label>

              <label>
                Existencia
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Ej. 10"
                  min="0"
                />
              </label>

              <div className="form-actions">
                {editingId && (
                  <button type="button" className="secondary-button" onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}

                <button type="submit">
                  {editingId ? 'Guardar cambios' : 'Registrar producto'}
                </button>
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Productos registrados</h2>
                <p>Consulta, filtra, edita y elimina productos del inventario.</p>
              </div>
            </div>

            <div className="filters">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o categoría"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Bajo stock">Bajo stock</option>
                <option value="Agotado">Agotado</option>
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
                      <th>Existencia</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>#{String(product.id).slice(-5)}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`badge status-${product.status.toLowerCase().replace(' ', '-')}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>{product.createdAt}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" onClick={() => handleEdit(product)}>
                              Editar
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;