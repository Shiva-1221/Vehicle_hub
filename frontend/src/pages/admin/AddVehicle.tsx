import { useState } from "react";
import type { FormEvent } from "react";

import {
  createVehicle,
} from "../../services/adminApi";

const AddVehicle = () => {
  const [name, setName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [vehicleModel, setVehicleModel] =
    useState("");

  const [type, setType] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [pricePerDay, setPricePerDay] =
    useState("");

  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [images, setImages] =
    useState<FileList | null>(null);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        name
      );

      formData.append(
        "brand",
        brand
      );

      formData.append(
        "vehicleModel",
        vehicleModel
      );

      formData.append(
        "type",
        type
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "pricePerDay",
        pricePerDay
      );

      formData.append(
        "registrationNumber",
        registrationNumber
      );

      if (images) {
        Array.from(images).forEach(
          (image) => {
            formData.append(
              "images",
              image
            );
          }
        );
      }

      await createVehicle(
        formData
      );

      alert(
        "Vehicle created successfully"
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Vehicle creation failed"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Vehicle</h1>

      <form
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) =>
            setBrand(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Model"
          value={vehicleModel}
          onChange={(e) =>
            setVehicleModel(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          placeholder="Type"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Price Per Day"
          value={pricePerDay}
          onChange={(e) =>
            setPricePerDay(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          placeholder="Registration Number"
          value={
            registrationNumber
          }
          onChange={(e) =>
            setRegistrationNumber(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) =>
            setImages(
              e.target.files
            )
          }
        />

        <br /><br />

        <button type="submit">
          Add Vehicle
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;