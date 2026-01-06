import { useEffect, useState } from "react";
import config from "../config";
import { MessageCircle, ShoppingBag } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const BuyerDashboard = ({ user, openChat }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/items`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch items", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">Marketplace</h2>
          <p className="text-gray-400">Discover items from other students</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <ShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-xl text-gray-300">No items available right now.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col h-full bg-white/5 border-white/10 hover:bg-white/10 p-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-black/50">
              <img
                src={`${config.API_BASE_URL}${item.imageUrl}`}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white border border-white/20">
                {item.category}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h3>
                <span className="font-bold text-green-400 whitespace-nowrap">₹{item.price}</span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <Button variant="success" className="w-full text-sm">
                  Buy Now
                </Button>
                <Button
                  variant="primary"
                  className="w-full text-sm"
                  onClick={() => openChat(item)}
                >
                  <MessageCircle size={16} />
                  Chat
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
