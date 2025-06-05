import { useState, useEffect } from "react";
import Select from "react-select";
import "./index.css";

const DOG_BREEDS_ENDPOINT = "https://api.thedogapi.com/v1/breeds"; // API

export function App() {
  // Handle API state
  const [breeds, setBreeds] = useState([]);
  // Fetching the API
  useEffect(() => {
    fetch(DOG_BREEDS_ENDPOINT)
      .then((res) => res.json())
      .then((data) => setBreeds(data));
  }, []);

  // Unique breed groups, avoid repetition and undefined/null values
  const uniqueBreedGroups = Array.from(
    new Set(breeds.map((b) => b.breed_group).filter(Boolean))
  );
  // Creating  an object of the breed group list with the correct select format
  const breedGroupOptions = uniqueBreedGroups.map((group) => ({
    value: group,
    label: group,
  }));

  const uniqueOrigins = Array.from(
    new Set(breeds.map((b) => b.origin).filter(Boolean))
  );

  const originOptions = uniqueOrigins.map((origin) => ({
    value: origin,
    label: origin,
  }));

  // Custom Styles for React-select
  const selectCustomStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f9fafb", // bg-gray-50
      borderColor: "#d1d5db", // border-gray-300
      padding: "0.25rem 0.5rem", // py-1 px-2
      borderRadius: "0.375rem", // rounded-md
      fontSize: "0.875rem", // text-sm
      cursor: "pointer",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff", // hover:bg-gray-200
      color: "#111827", // text-gray-900
      cursor: "pointer",
      padding: "0.5rem",
    }),
  };

  // State for selected breed group
  const [selectedBreedGroup, setSelectedBreedGroup] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  // Filtrar razas según grupo seleccionado
  let filteredBreeds = breeds;

  if (selectedBreedGroup) {
    filteredBreeds = filteredBreeds.filter(
      (b) => b.breed_group === selectedBreedGroup.value
    );
  }

  if (selectedOrigin) {
    filteredBreeds = filteredBreeds.filter(
      (b) => b.origin === selectedOrigin.value
    );
  }


    
    

  // State for the dog selected to show more info
  const [selectedDog, setSelectedDog] = useState(null);

  return (
    <>
      <header className='bg-white py-6'>
        <h1 className='text-3xl font-bold uppercase border-b border-b-gray-400'>
          Every Dog
        </h1>
      </header>
      <main className='lg:flex gap-4'>
        <aside className='flex justify-end lg:block lg:w-1/4'>
          <div className='bg-white w-full sticky top-6 left-0 z-10'>
            <Select
              isClearable
              className='mb-3 w-full'
              // isMulti
              placeholder='Filter by breed'
              options={breedGroupOptions}
              styles={selectCustomStyles}
              value={selectedBreedGroup}
              onChange={setSelectedBreedGroup}
            />
            <Select
              isClearable
              className='mb-3 w-full'
              placeholder='Filter by origin'
              options={originOptions}
              styles={selectCustomStyles}
              value={selectedOrigin}
              onChange={setSelectedOrigin}
            />
          </div>
        </aside>

        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {filteredBreeds.map((breed) => {
            const { id, reference_image_id, name } = breed;
            return (
              <li
                key={id}
                onClick={() => setSelectedDog(breed)}
                className='bg-white rounded shadow overflow-hidden md:hover:scale-105 transition-transform cursor-pointer'
              >
                {reference_image_id && (
                  <img
                    className='w-full h-56 object-cover'
                    src={`https://cdn2.thedogapi.com/images/${reference_image_id}.jpg`}
                    alt={name}
                  />
                )}
                <div className='p-2 text-center font-medium'>{name}</div>
              </li>
            );
          })}
        </ul>

        {/* Modal cwith more information of the selected dog */}
        {selectedDog && (
          <div className='fixed inset-0 bg-black/85  flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative'>
              <button
                className='absolute top-2 right-3 text-gray-900 hover:text-black hover:scale-115 text-xl font-bold'
                onClick={() => setSelectedDog(null)}
              >
                &times;
              </button>
              <h2 className='text-xl font-bold mb-4'>{selectedDog.name}</h2>
              {selectedDog.reference_image_id && (
                <img
                  src={`https://cdn2.thedogapi.com/images/${selectedDog.reference_image_id}.jpg`}
                  alt={selectedDog.name}
                  className='w-full h-80 object-cover rounded mb-4'
                />
              )}
              <p>
                <strong>Group:</strong> {selectedDog.breed_group || "Unknown"}
              </p>
              <p>
                <strong>Life Span:</strong> {selectedDog.life_span}
              </p>
              <p>
                <strong>Temperament:</strong> {selectedDog.temperament}
              </p>
              <p>
                <strong>Origin:</strong> {selectedDog.origin || "Unknown"}
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
