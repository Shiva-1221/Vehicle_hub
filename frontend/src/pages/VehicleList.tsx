import { useEffect, useState } from "react";

import VehicleCard from "../components/VehicleCard";
import { getVehicles } from "../services/vehicleApi";
import type { Vehicle } from "../types/vehicle";

const VehicleList = () => {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [fuelType, setFuelType] =
    useState("");

  const [transmission, setTransmission] =
    useState("");

  const [seats, setSeats] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVehicles({
        search,
        type,
        minPrice,
        maxPrice,
        fuelType,
        transmission,
        seats,
        location,
        sort,
        page,
        limit: 6,
      });

      setVehicles(data.vehicles);

      setTotalPages(
        data.pagination.totalPages
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [page, sort]);

  const handleSearch = () => {
    setPage(1);
    loadVehicles();
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setFuelType("");
    setTransmission("");
    setSeats("");
    setLocation("");
    setSort("newest");
    setPage(1);
  };

  return (
    <main className="vehicle-page">
      <div className="vehicle-container">

        {/* Header */}
        <div className="vehicle-header">
          <h1>Available Vehicles</h1>

          <p>
            Find the perfect vehicle for
            your journey.
          </p>
        </div>

        {/* Filters */}
        <div className="filter-card">

          {/* Search */}
          <div className="search-row">
            <input
              type="text"
              placeholder="Search name, brand or model..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="filters-grid">

            <div className="filter-group">
              <label>Vehicle Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="">
                  All Types
                </option>

                <option value="Car">
                  Car
                </option>

                <option value="SUV">
                  SUV
                </option>

                <option value="Bike">
                  Bike
                </option>

                <option value="Van">
                  Van
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Price</label>

              <input
                type="number"
                placeholder="₹ Min"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Maximum Price</label>

              <input
                type="number"
                placeholder="₹ Max"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Fuel Type</label>

              <select
                value={fuelType}
                onChange={(e) =>
                  setFuelType(e.target.value)
                }
              >
                <option value="">
                  All Fuel
                </option>

                <option value="Petrol">
                  Petrol
                </option>

                <option value="Diesel">
                  Diesel
                </option>

                <option value="Electric">
                  Electric
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label>Transmission</label>

              <select
                value={transmission}
                onChange={(e) =>
                  setTransmission(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Transmission
                </option>

                <option value="Manual">
                  Manual
                </option>

                <option value="Automatic">
                  Automatic
                </option>
              </select>
            </div>

            <div className="filter-group">
              <label>Seats</label>

              <input
                type="number"
                placeholder="Number of seats"
                value={seats}
                onChange={(e) =>
                  setSeats(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Location</label>

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="price_asc">
                  Price: Low → High
                </option>

                <option value="price_desc">
                  Price: High → Low
                </option>
              </select>
            </div>

          </div>

          {/* Actions */}
          <div className="filter-actions">

            <button
              onClick={() => {
                setPage(1);
                loadVehicles();
              }}
            >
              Apply Filters
            </button>

            <button
              className="clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            Loading vehicles...
          </div>
        )}

        {/* No vehicles */}
        {!loading &&
          vehicles.length === 0 && (
            <div className="loading">
              No vehicles found.
            </div>
          )}

        {/* Vehicles */}
        {!loading &&
          vehicles.length > 0 && (
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                />
              ))}
            </div>
          )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(page + 1)
              }
            >
              Next
            </button>

          </div>
        )}

      </div>
    </main>
  );
};

export default VehicleList;