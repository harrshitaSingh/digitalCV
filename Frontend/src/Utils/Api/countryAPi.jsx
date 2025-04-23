// countryAPI.js
export const fetchCountries = async () => {
    try {
        const response = await fetch('https://api.first.org/data/v1/countries');
        const data = await response.json();

        const countryList = Object.values(data.data)
            .map((c) => ({
                label: c.country,
                value: c.country,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        return countryList;
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return [];
    }
};

export const callCountryApi = (fn, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log("Debounced function called");
            fn(...args);
        }, delay);
    };
};
