/** @format */

import { useEffect, useState } from 'react';

import './App.css';

function App() {
	const [address, setAddress] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const api_key = '4H21FJED4kueijuhoS5GVQ44036';

	const ukLatitude = 54.0; // Approximate center latitude of the UK
	const ukLongitude = -2.0; // Approximate center longitude of the UK
	const ukRadius = 10000; // Radius in kilometers for filtering

	const handleONChange = (e) => {
		setAddress(e.target.value);

		// If user types something, show dropdown
		if (e.target.value.length > 0) {
			setShowDropdown(true);
		} else {
			setShowDropdown(false); // Hide dropdown when input is empty
		}
	};

	useEffect(() => {
		// Avoid fetching suggestions when the address is empty
		if (!address) {
			setSuggestions([]);
			return;
		}

		// Fetch address suggestions
		async function fetchAddressSuggestion() {
			try {
				const response = await fetch(
					`https://api.getAddress.io/autocomplete/${address}?api-key=${api_key}&lat=${ukLatitude}&lon=${ukLongitude}&radius=${ukRadius}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setSuggestions(data.suggestions || []); // Set suggestions from the response
			} catch (error) {
				console.error('Error fetching suggestions:', error);
				setSuggestions([]); // Clear suggestions on error
			}
		}

		fetchAddressSuggestion();
	}, [address]);

	const handleSuggestionClick = (suggestion) => {
		setAddress(suggestion); // Set the clicked suggestion in the input field
		setShowDropdown(false); // Hide dropdown after selection
	};
	return (
		<>
			<div className='wrapper'>
				<input
					className='address'
					value={address}
					onChange={handleONChange}
					placeholder='Search Address'
				/>
				{/* Dropdown with suggestions */}
				{showDropdown && suggestions.length > 0 && (
					<ul className='suggestions-dropdown'>
						{suggestions.map((suggestion, index) => (
							<li
								key={index}
								className='suggestion-item'
								onClick={() => handleSuggestionClick(suggestion.address)}
							>
								{suggestion.address}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
}

export default App;
