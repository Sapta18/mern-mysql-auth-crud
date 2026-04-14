import { useEffect, useState } from "react";
import { getItems, getStats, createItem, updateItem, deleteItem } from "../api/itemApi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total:0, active:0, pending:0, completed:0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", status:"active" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes] = await Promise.all([getItems(), getStats()]);
      setItems(itemsRes.data);
      setStats(statsRes.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if(message||error){ const t=setTimeout(()=>{setMessage("");setError("")},2500); return ()=>clearTimeout(t);} }, [message,error]);

  const logout = () => { localStorage.clear(); navigate('/'); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editId) { await updateItem(editId, form); setMessage('Item updated'); }
      else { await createItem(form); setMessage('Item added'); }
      setEditId(null);
      setForm({ title:'', description:'', status:'active' });
      loadData();
    } catch { setError('Action failed'); }
    finally { setSaving(false); }
  };

  const editItem = (item) => { setEditId(item.id); setForm({ title:item.title, description:item.description, status:item.status }); };
  const removeItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteItem(id); setMessage('Item deleted'); loadData();
  };

  const changeStatus = async (item, status) => {
    await updateItem(item.id, { title:item.title, description:item.description, status });
    setMessage('Status updated'); loadData();
  };

  const cards = [
    ['Total', stats.total, '📦'],
    ['Active', stats.active, '🟢'],
    ['Pending', stats.pending, '🟡'],
    ['Completed', stats.completed, '✅']
  ];

  return (
    <div className='min-h-screen bg-slate-100'>
      <nav className='bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <div className='flex items-center gap-4'>
          <span className='text-sm md:text-base'>Hi, {user?.name}</span>
          <button onClick={logout} className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition'>Logout</button>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto p-6'>
        {message && <div className='mb-4 bg-green-100 text-green-700 p-3 rounded-lg'>{message}</div>}
        {error && <div className='mb-4 bg-red-100 text-red-700 p-3 rounded-lg'>{error}</div>}

        {loading ? <div className='text-center py-10 text-lg font-semibold'>Loading...</div> : <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            {cards.map(([title,val,icon]) => (
              <div key={title} className='bg-white rounded-2xl shadow p-5 hover:-translate-y-1 transition'>
                <div className='flex justify-between items-center'>
                  <p className='text-gray-500'>{title}</p><span>{icon}</span>
                </div>
                <h2 className='text-3xl font-bold mt-2'>{val || 0}</h2>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className='bg-white rounded-2xl shadow p-5 mb-6 space-y-3'>
            <h2 className='text-xl font-semibold'>{editId ? 'Edit Item' : 'Add New Item'}</h2>
            <input className='w-full border p-3 rounded-lg' placeholder='Title' required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <textarea className='w-full border p-3 rounded-lg' rows='3' placeholder='Description' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <select className='w-full border p-3 rounded-lg' value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value='active'>Active</option>
              <option value='pending'>Pending</option>
              <option value='completed'>Completed</option>
            </select>
            <button disabled={saving} className='w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg'>
              {saving ? 'Please wait...' : editId ? 'Update Item' : 'Add Item'}
            </button>
          </form>

          <div className='grid gap-4'>
            {items.length === 0 ? <div className='bg-white p-6 rounded-2xl shadow text-center text-gray-500'>No items found</div> : items.map(item => (
              <div key={item.id} className='bg-white rounded-2xl shadow p-5'>
                <div className='flex flex-col md:flex-row md:justify-between gap-4'>
                  <div>
                    <h3 className='text-lg font-bold'>{item.title}</h3>
                    <p className='text-gray-600'>{item.description}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={()=>editItem(item)} className='bg-yellow-400 px-4 py-2 rounded-lg'>Edit</button>
                    <button onClick={()=>removeItem(item.id)} className='bg-red-500 text-white px-4 py-2 rounded-lg'>Delete</button>
                  </div>
                </div>
                <select className='mt-3 border p-2 rounded-lg' value={item.status} onChange={e=>changeStatus(item,e.target.value)}>
                  <option value='active'>Active</option>
                  <option value='pending'>Pending</option>
                  <option value='completed'>Completed</option>
                </select>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}