import React, { useEffect, useState, useMemo } from "react";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 200); // 300ms delay

    return () => clearTimeout(delay);
  }, [search]);

  // Fetch food data on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const res = await fetch(`${BASE_URL}/api/foodData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setFoodItem(Array.isArray(data?.[0]) ? data[0] : []);
      setFoodCat(Array.isArray(data?.[1]) ? data[1] : []);
    } catch (err) {
      console.error("Error fetching foodData:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Memoized filtered items grouped by category
  const filteredItemsByCategory = useMemo(() => {
    const result = {};
    for (let category of foodCat) {
      const items = foodItem.filter(
        (item) =>
          item?.CategoryName === category?.CategoryName &&
          item?.name?.toLowerCase().includes(debouncedSearch)
      );
      if (items.length > 0 || debouncedSearch === "") {
        result[category.CategoryName] = items;
      }
    }
    return result;
  }, [foodCat, foodItem, debouncedSearch]);

  const carouselImages = [
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=1200&q=60",
  ];

  return (
    <>
      {/* ---------- Carousel ---------- */}
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="2000"
        style={{ maxHeight: "500px", overflow: "hidden" }}
      >
        <div className="carousel-inner">
          {/* Search bar overlay */}
          <div
            className="carousel-caption d-none d-md-block"
            style={{ zIndex: 10 }}
          >
            <div className="d-flex justify-content-center position-relative">
  <input
    className="form-control me-2 w-50"
    type="search"
    placeholder="Search food or category"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      paddingRight: "2.5rem",
      WebkitAppearance: "none",
      MozAppearance: "none",
    }}
  />

</div>

          </div>

          {/* Slides */}
          {carouselImages.map((url, idx) => (
            <div
              key={url}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <img
                src={url}
                className="d-block w-100"
                alt={`Slide ${idx + 1}`}
                style={{ objectFit: "cover", height: "500px" }}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ---------- Food Cards ---------- */}
      <div className="container my-4">
        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border" role="status" />
          </div>
        ) : Object.keys(filteredItemsByCategory).length === 0 ? (
          <h4 className="text-center">No items found matching your search.</h4>
        ) : (
          Object.entries(filteredItemsByCategory).map(([category, items]) => (
            <div key={category} className="row mb-4">
              <div className="fs-3 m-3">{category}</div>
              <hr />
              {items.map((item) => (
                <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-3">
                  <Card
                    foodName={item.name}
                    imgSrc={item.img}
                    options={item?.options?.[0]}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}
