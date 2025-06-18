import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card   from "../components/Card";

export default function Home() {
  /* ---------------- state ---------------- */
  const [foodCat,  setFoodCat]  = useState([]);   // categories
  const [foodItem, setFoodItem] = useState([]);   // items
  const [search,   setSearch]   = useState("");   // search box
  const [loading,  setLoading]  = useState(true); // fetch status

  /* ---------------- fetch once on mount ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res  = await fetch("https://urbanbite-backend.onrender.com/api/foodData",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json(); // API returns [ itemsArr, categoriesArr ]
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

  /* ---------------- carousel images ---------------- */
  const carouselImages = [
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=1200&q=60",
  ];

  /* ---------------- UI ---------------- */
  return (
    <>
      

      {/* ---------- Carousel ---------- */}
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        style={{ maxHeight: "500px", overflow: "hidden" }}
      >
        <div className="carousel-inner">
          {/* Search bar overlay */}
          <div
            className="carousel-caption d-none d-md-block"
            style={{ zIndex: 10 }}
          >
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2 w-50"
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

      {/* ---------- Food cards ---------- */}
      <div className="container my-4">
        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border" role="status" />
          </div>
        ) : foodCat.length === 0 ? (
          <h4 className="text-center">No categories found.</h4>
        ) : (
          foodCat.map((cat) => {
            // All items for this category that match the search term
            const itemsForCat = foodItem.filter(
              (item) =>
                item?.CategoryName === cat?.CategoryName &&
                item?.name?.toLowerCase().includes(search.toLowerCase())
            );

            return (
              <div key={cat._id} className="row mb-4">
                <div className="fs-3 m-3">{cat.CategoryName}</div>
                <hr />

                {itemsForCat.length === 0 ? (
                  <p className="text-muted ms-3">No items match your search.</p>
                ) : (
                  itemsForCat.map((item) => (
                    <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-3">
                      <Card
                        foodName={item.name}
                        imgSrc={item.img}                // may be undefined → handled in Card.js
                        options={item?.options?.[0]}     // safe optional chaining
                      />
                    </div>
                  ))
                )}
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </>
  );
}
