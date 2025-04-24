

// Homepage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const salads = [
    {
      name: "Aloo Tikki Burger",
      price: "£2.65",
      image: "burger.jpeg",
      calories: "350 kcal",
      servings: "1 person",
      description: "A crispy potato patty stuffed between freshly baked buns with tangy sauces."
    },
    {
      name: "Farmhouse Pizza",
      price: "£10",
      image: "pizza.webp",
      calories: "800 kcal",
      servings: "2 persons",
      description: "Loaded with crunchy veggies, gooey cheese, and classic pizza sauce on a thin crust."
    },
    {
      name: "Chole Bhature",
      price: "£20",
      image: "chole.jpg",
      calories: "700 kcal",
      servings: "1 person",
      description: "Spicy chickpeas served with fluffy, deep-fried bread – a North Indian favorite."
    },
    {
      name: "Chocolate Cake",
      price: "£20",
      image: "cake.jpeg",
      calories: "450 kcal",
      servings: "2 persons",
      description: "Rich and moist chocolate sponge layered with silky chocolate ganache."
    },
    {
      name: "Paneer Tikka",
      price: "£20",
      image: "paneer.jpeg",
      calories: "300 kcal",
      servings: "1 person",
      description: "Chunks of marinated cottage cheese grilled to perfection with spices and herbs."
    },
    {
      name: "Veg Biryani",
      price: "£20",
      image: "veg.jpeg",
      calories: "550 kcal",
      servings: "1 person",
      description: "A fragrant mix of basmati rice and fresh vegetables cooked with aromatic spices and herbs, served with raita."
    },
    {
      name: "Chicken Biryani",
      price: "£20",
      image: "chicken.jpeg",
      calories: "650 kcal",
      servings: "1 person",
      description: "Succulent chicken pieces layered with spiced basmati rice, slow-cooked to perfection in traditional dum style."
    },
    {
      name: "Idli Sambhar",
      price: "£20",
      image: "idli.jpeg",
      calories: "300 kcal",
      servings: "1 person",
      description: "Soft, fluffy steamed rice cakes served with piping hot tangy lentil soup and a touch of South Indian spices."
    }
  ];

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white py-10 px-6">
      <header className="flex justify-between items-center mb-10">
        <div className="text-sm flex gap-4">
          <span>🌐 Location: USA</span>
        </div>
        <h1 className="text-2xl font-bold">FoodieYou</h1>
      </header>

      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Order your<br />Favourite delights !!</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          "Craving something delicious? Order in seconds, enjoy in minutes!"
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {salads.map((salad, index) => (
          <div
            key={index}
            className={`rounded p-4 shadow-lg flex flex-col items-center gap-2 transition-all duration-300 bg-white`}
          >
            <img
              src={salad.image}
              alt={salad.name}
              className="w-full h-44 object-contain"
            />
            <h3 className="font-semibold text-lg text-center">{salad.name}</h3>
            <div className="text-lg font-bold">{salad.price}</div>
            <button
              className="bg-yellow-800 hover:bg-yellow-700 text-white px-3 py-1 rounded-full text-md mt-2"
              onClick={() => navigate(`/checkout/${index}`)}
            >
              Order Now
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

