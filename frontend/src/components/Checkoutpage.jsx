
import React from 'react';
import { useParams } from 'react-router-dom';

const salads = [
  {
    name: "Aloo Tikki Burger",
    price: "$2.65",
    image: "burger.jpeg",
    calories: "350 kcal",
    servings: "1 person",
    description: "A crispy potato patty stuffed between freshly baked buns with tangy sauces."
  },
  {
    name: "Farmhouse Pizza",
    price: "$10",
    image: "pizza.webp",
    calories: "800 kcal",
    servings: "2 persons",
    description: "Loaded with crunchy veggies, gooey cheese, and classic pizza sauce on a thin crust."
  },
  {
    name: "Chole Bhature",
    price: "$20",
    image: "chole.jpg",
    calories: "700 kcal",
    servings: "1 person",
    description: "Spicy chickpeas served with fluffy, deep-fried bread – a North Indian favorite."
  },
  {
    name: "Chocolate Cake",
    price: "$20",
    image: "cake.jpeg",
    calories: "450 kcal",
    servings: "2 persons",
    description: "Rich and moist chocolate sponge layered with silky chocolate ganache."
  },
  {
    name: "Paneer Tikka",
    price: "$20",
    image: "paneer.jpeg",
    calories: "300 kcal",
    servings: "1 person",
    description: "Chunks of marinated cottage cheese grilled to perfection with spices and herbs."
  },
  {
    name: "Veg Biryani",
    price: "$20",
    image: "veg.jpeg",
    calories: "550 kcal",
    servings: "1 person",
    description: "A fragrant mix of basmati rice and fresh vegetables cooked with aromatic spices and herbs, served with raita."
  },
  {
    name: "Chicken Biryani",
    price: "$20",
    image: "chicken.jpeg",
    calories: "650 kcal",
    servings: "1 person",
    description: "Succulent chicken pieces layered with spiced basmati rice, slow-cooked to perfection in traditional dum style."
  },
  {
    name: "Idli Sambhar",
    price: "$20",
    image: "idli.jpeg",
    calories: "300 kcal",
    servings: "1 person",
    description: "Soft, fluffy steamed rice cakes served with piping hot tangy lentil soup and a touch of South Indian spices."
  }
  
  
  
  
];

export default function Checkoutpage() {
  const { id } = useParams();
  const salad = salads[parseInt(id)];

  if (!salad) return <p>Food Item not found</p>;

  const onCheckout = async () => {
    try {
      const amountValue = parseFloat(salad.price.replace('$', '')); // Convert to minor units (e.g., cents)
      const currency = "USD"; // Or dynamically set based on user/location

      const response = await fetch("http://localhost:3000/dev/getpaymentpagelink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountValue,
          currency: currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate payment link");
      }

      const data = await response.json();
      const paymentUrl = data.url;

      if (paymentUrl) {
        window.location.href = paymentUrl; // Redirect to Adyen payment link
      } else {
        alert("Payment link not generated.");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Error creating payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white py-10 px-6">
      {/* HEADER same as Homepage */}
      <header className="flex justify-between items-center mb-10">
        <div className="text-sm flex gap-4">
          <span>🌐 Location: USA</span>
        </div>
        <h1 className="text-2xl font-bold">FoodieYou</h1>
      </header>

      {/* Optional - if you want the main title like homepage */}
      <section className="text-center mb-12">
        <h2 className="text-xl font-bold mb-4">Your Selected Delight</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Ready to savor this meal? Confirm your order and dig in!
        </p>
      </section>

      <div className="flex flex-col items-center text-center">
        <img
          src={`/${salad.image}`}
          alt={salad.name}
          className="w-full max-w-md h-48 object-contain mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{salad.name}</h1>
        <p className="text-gray-500 mb-1">{salad.calories} • {salad.servings}</p>
        <p className="text-lg font-semibold mb-4">{salad.price}</p>
        <p className="text-gray-700 max-w-md mb-6">{salad.description}</p>
        <button
          className="bg-yellow-900 hover:bg-yellow-800 cursor-pointer text-white px-6 py-2 rounded-full"
          onClick={onCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

