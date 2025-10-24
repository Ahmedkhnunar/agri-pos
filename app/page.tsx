'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const [modalOpen, setModalOpen] = useState(false);

  const menuItems = ['Dashboard', 'POS', 'Categories', 'Inventory', 'Reports'];

  // POS & Inventory data
  const [posData, setPosData] = useState<{id:number,item:string,amount:number}[]>([
    {id:1,item:'Apple',amount:10},
    {id:2,item:'Banana',amount:15},
  ]);
  const [inventoryData, setInventoryData] = useState<{id:number,item:string,qty:number}[]>([
    {id:1,item:'Apple',qty:100},
    {id:2,item:'Banana',qty:150},
  ]);

  const [formData, setFormData] = useState<{item:string,amount:number,qty?:number}>({item:'',amount:0});
  const [editingId, setEditingId] = useState<number | null>(null);

  // Electron integration
  useEffect(() => {
    // Check if we're running in Electron
    if (typeof window !== 'undefined' && window.electronAPI) {
      // Listen for menu actions from Electron
      window.electronAPI.onMenuAction((event, action) => {
        switch (action) {
          case 'new-sale':
            setFormData({item:'',amount:0});
            setEditingId(null);
            setModalOpen(true);
            break;
          case 'dashboard':
            setActivePage('Dashboard');
            break;
          case 'pos':
            setActivePage('POS');
            break;
          case 'inventory':
            setActivePage('Inventory');
            break;
          case 'toggle-sidebar':
            setSidebarOpen(!sidebarOpen);
            break;
          case 'about':
            alert('AgriPOS v1.0.0\nPoint of Sale System for Agriculture\nDeveloped by Ahmed');
            break;
        }
      });

      // Cleanup listeners on unmount
      return () => {
        window.electronAPI.removeAllListeners('menu-action');
      };
    }
  }, [sidebarOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActivePage('Dashboard');
            break;
          case '2':
            event.preventDefault();
            setActivePage('POS');
            break;
          case '3':
            event.preventDefault();
            setActivePage('Inventory');
            break;
          case 'b':
            event.preventDefault();
            setSidebarOpen(!sidebarOpen);
            break;
          case 'n':
            event.preventDefault();
            setFormData({item:'',amount:0});
            setEditingId(null);
            setModalOpen(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const renderContent = () => {
    if(activePage==='Dashboard'){
      return <div>Dashboard Content</div>;
    }
    if(activePage==='POS'){
      return (
        <div>
          <button 
            className="mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={()=>{setFormData({item:'',amount:0}); setEditingId(null); setModalOpen(true)}}
          >
            Add POS Item
          </button>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posData.map(row=>(
                <tr key={row.id}>
                  <td className="border px-2 py-1">{row.id}</td>
                  <td className="border px-2 py-1">{row.item}</td>
                  <td className="border px-2 py-1">{row.amount}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button className="px-2 py-1 bg-yellow-400 rounded" 
                      onClick={()=>{setFormData({item:row.item,amount:row.amount}); setEditingId(row.id); setModalOpen(true)}}>
                      Edit
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded" 
                      onClick={()=>setPosData(posData.filter(d=>d.id!==row.id))}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    if(activePage==='Inventory'){
      return (
        <div>
          <button 
            className="mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={()=>{setFormData({item:'',amount:0,qty:0}); setEditingId(null); setModalOpen(true)}}
          >
            Add Inventory Item
          </button>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map(row=>(
                <tr key={row.id}>
                  <td className="border px-2 py-1">{row.id}</td>
                  <td className="border px-2 py-1">{row.item}</td>
                  <td className="border px-2 py-1">{row.qty}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button className="px-2 py-1 bg-yellow-400 rounded" 
                      onClick={()=>{setFormData({item:row.item,amount:0,qty:row.qty}); setEditingId(row.id); setModalOpen(true)}}>
                      Edit
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded" 
                      onClick={()=>setInventoryData(inventoryData.filter(d=>d.id!==row.id))}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return <div>{activePage} Content</div>
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && <span className="font-bold text-lg">AgriPOS</span>}
          <button className="p-1 focus:outline-none" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
        </div>
        <nav className="mt-4">
          {menuItems.map(item=>(
            <button key={item} className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${activePage===item?'bg-gray-700':''}`} onClick={()=>setActivePage(item)}>
              {sidebarOpen ? item : item[0]}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100 relative">
        <h1 className="text-2xl font-bold mb-4">{activePage}</h1>
        {renderContent()}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96 relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={()=>setModalOpen(false)}>✖</button>
              <h2 className="text-xl font-bold mb-4">{activePage} Form</h2>
              <form className="flex flex-col gap-3" onSubmit={e=>{
                e.preventDefault();
                if(activePage==='POS'){
                  if(editingId){
                    setPosData(posData.map(d=>d.id===editingId?{...d,item:formData.item,amount:formData.amount}:d));
                  } else {
                    setPosData([...posData,{id:Date.now(),item:formData.item,amount:formData.amount}]);
                  }
                }
                if(activePage==='Inventory'){
                  if(editingId){
                    setInventoryData(inventoryData.map(d=>d.id===editingId?{...d,item:formData.item,qty:formData.qty||0}:d));
                  } else {
                    setInventoryData([...inventoryData,{id:Date.now(),item:formData.item,qty:formData.qty||0}]);
                  }
                }
                setModalOpen(false);
              }}>
                <input type="text" placeholder="Item" className="border p-2 rounded" value={formData.item} onChange={e=>setFormData({...formData,item:e.target.value})}/>
                {activePage==='POS' && <input type="number" placeholder="Amount" className="border p-2 rounded" value={formData.amount} onChange={e=>setFormData({...formData,amount:Number(e.target.value)})}/>}
                {activePage==='Inventory' && <input type="number" placeholder="Qty" className="border p-2 rounded" value={formData.qty} onChange={e=>setFormData({...formData,qty:Number(e.target.value)})}/>}
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={()=>setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
