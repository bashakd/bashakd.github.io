
async function fetchAgentData() {
    try {
        const response = await fetch('agents.json');
        const data = await response.json();
        const agents = data.agents;
        
        
        displayAgents('Any', agents);

        
        createRoleButtons(agents);
    } catch (error) {
        console.error("Error loading agent data:", error);
    }
}


function createAgentCard(agent) {
    return `
        <div class="col-md-4 agent-card">
            <div class="card">
                <img src="${agent.displayIcon}" class="card-img-top" alt="${agent.displayName}">
                <div class="card-body agent-info">
                    <h5 class="card-title agent-name">${agent.displayName}</h5>
                    <p class="card-text">Role: ${agent.role}</p> 
                    <audio controls class="agent-voice-line" data-voice-line="${agent.voiceLine}">
                        <source src="${agent.voiceLine}" type="audio/mp4">
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            </div>
        </div>
    `;
}


function displayAgents(role, agents) {
    const agentGallery = document.getElementById("agent-gallery");
    agentGallery.innerHTML = ""; 
    const filteredAgents = agents.filter(agent => agent.role === role || role === 'Any');
    filteredAgents.forEach(agent => {
        agentGallery.innerHTML += createAgentCard(agent);
    });
}


function createRoleButtons(agents) {
    const roles = ['Coffee?','Duelist', 'Controller', 'Initiator', 'Sentinel'];
    const buttonContainer = document.getElementById('role-buttons'); 

    roles.forEach(role => {
        const button = document.createElement('button');
        button.textContent = role;
        button.classList.add('btn', 'btn-primary', 'btn-block'); 
        button.addEventListener('click', () => {
            if (role === 'Coffee?') {
                fetchCoffeeData(); 
            } else {
                displayAgents(role, agents);
            }
        });
        buttonContainer.appendChild(button);
    });
}

async function fetchCoffeeData() {
    try {
        const hotResponse = await fetch('https://api.sampleapis.com/coffee/hot');
        const hotData = await hotResponse.json();
        
        const icedResponse = await fetch('https://api.sampleapis.com/coffee/iced');
        const icedData = await icedResponse.json();
        
       
        displayCoffeeData(hotData, icedData);
    } catch (error) {
        console.error("Error fetching coffee data:", error);
    }
}


function displayCoffeeData(hotData, icedData) {
    const agentGallery = document.getElementById("agent-gallery");
    agentGallery.innerHTML = "";  
    function translateDescription(description) {
        if (!description) {
            return "No description available.";
        }
        return description; 
    }


   
    const icedSection = document.createElement('div');
    icedSection.innerHTML = `
        <h2 class="coffee-section-title">Iced Coffee</h2>
        <div class="row">
            ${icedData.map(coffee => `
                <div class="col-md-4">
                    <div class="coffee-card">
                        <img src="${coffee.image}" class="card-img-top" alt="${coffee.title}">
                        <div class="card-body">
                            <h5 class="card-title">${coffee.title}</h5>
                            <p class="card-text">${translateDescription(coffee.description)}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    agentGallery.appendChild(icedSection);
}

fetchAgentData();
