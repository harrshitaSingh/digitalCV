// src/utils/api/pincodeAPI.js

export const fetchCityByPincode = async (pincode) => {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        const district = data[0]?.PostOffice?.[0]?.District || '';
        return district;
    } catch (error) {
        console.error('Failed to fetch city from pincode:', error);
        return '';
    }
};
