document.getElementById('address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('address').value;
    const issueArea = document.getElementById('issue-area').value;
    const resultsContainer = document.getElementById('results-container');
    const results = document.getElementById('results');

    results.innerHTML = '';
    resultsContainer.style.display = 'none';

    try {
        const representatives = await fetchRepresentatives(address);
        const stafferData = await fetchStafferData();
        const relevantStaffers = findRelevantStaffers(representatives, stafferData, issueArea);

        if (relevantStaffers.length > 0) {
            relevantStaffers.forEach(({representative, staffer, email}) => {
                results.innerHTML += `<p><strong>${representative}</strong> - ${staffer} (${email})</p>`;
            });
            resultsContainer.style.display = 'block';
        } else {
            alert('No relevant staffers found for the selected issue area.');
        }
    } catch (error) {
        alert('An error occurred while fetching data. Please try again.');
    }
});

async function fetchRepresentatives(address) {
    const apiKey = 'AIzaSyARMjbt1tV6CdU8tcONxBVpHbXcZNBCGjc';
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${encodeURIComponent(address)}&roles=legislatorUpperBody&roles=legislatorLowerBody`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.officials.map((official) => official.name);
}

async function fetchStafferData() {
    // Replace with the URL to your CSV file
    const url = 'bgov-federal-staff-full.csv';

    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split('\n').slice(1); // Remove header line

    return lines.map((line) => {
        // Split line by comma to get individual values
        const [StafferName, MemberName, Issues, email] = line.split(',');

        // Return an object representing the row
        return {
            StafferName,
            MemberName,
            Issues,
            email
        };
    });
}
