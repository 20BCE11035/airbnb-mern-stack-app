import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";
import PhotosUploader from "../components/PhotosUploader";

export const PlacesPage = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtrainfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState("")

  function inputHeader(text) {
    return <h2 className=" text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(description) {
    return <p className=" text-gray-500 text-sm">{description}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addNewPlace(ev) {
    ev.preventDefault()
    const placeData = {
      title, address, addedPhotos, description, perks, extraInfo,
      checkIn, checkOut, maxGuests
    }
    try { 
      await axios.post('/places', placeData)
      setRedirect('/account/places')
    } catch (err) {
      console.log("Error Saving Places", err)
    }
  }

  if (redirect) {
    return <Navigate to={redirect}/>
  }

  return (
    <div>
      {action !== "new" && (
        <div className=" text-center py-6">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}

      {action === "new" && (
        <div>
          <form onSubmit={addNewPlace}>
            {preInput(
              "Title",
              "Title for you place should be short and catchy"
            )}
            <input
              onChange={(ev) => {
                setTitle(ev.target.value);
              }}
              value={title}
              type="text"
              placeholder="title, for example my lovely apartment"
            ></input>

            {preInput("Address", "Address to this place")}
            <input
              onChange={(ev) => {
                setAddress(ev.target.value);
              }}
              value={address}
              type="text"
              placeholder="address"
            ></input>

            {preInput("Photos", "More = better")}
            <PhotosUploader
              addedPhotos={addedPhotos}
              setAddedPhotos={setAddedPhotos}
            />

            {preInput("Description", "Description of your place")}
            <textarea
              value={description}
              onChange={(ev) => {
                setDescription(ev.target.value);
              }}
            />

            {preInput("Perks", "perks of your place")}

            <Perks selected={perks} setPerks={setPerks} />

            {preInput("Extra Info", "house rules, etc")}
            <textarea
              value={extraInfo}
              onChange={(ev) => {
                setExtrainfo(ev.target.value);
              }}
            />

            {preInput(
              "Check in & Out times",
              "add check in and out times & max guests"
            )}

            <div className=" grid sm:grid-cols-3 gap-2">
              <div>
                <h3>Check in time</h3>
                <input
                  value={checkIn}
                  onChange={(ev) => {
                    setCheckIn(ev.target.value);
                  }}
                  type="text"
                  placeholder="14:00"
                />
              </div>
              <div>
                <h3>Check out time</h3>
                <input
                  value={checkOut}
                  onChange={(ev) => {
                    setCheckOut(ev.target.value);
                  }}
                  type="text"
                  placeholder="17:00"
                />
              </div>
              <div>
                <h3>Max Guests</h3>
                <input
                  value={maxGuests}
                  onChange={(ev) => {
                    setMaxGuests(ev.target.value);
                  }}
                  type="number"
                  placeholder="10"
                />
              </div>
            </div>
            <button className=" primary my-5">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};
