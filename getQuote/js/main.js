document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const form = document.getElementById('agreementForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const actionsSlider = document.getElementById('actionsPerMonth');
    const actionsValue = document.getElementById('actionsValue');
    const unlimitedUsersCheckbox = document.getElementById('unlimitedUsers');
    const additionalUsersInput = document.getElementById('additionalUsers');
    const usersValue = document.getElementById('usersValue');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const totalPriceElement = document.getElementById('totalPrice');
    const rawDataRetention = document.getElementById('rawDataRetention');
    const aggregatedDataRetention = document.getElementById('aggregatedDataRetention');
    const savedClientsDropdown = document.getElementById('savedClients');
    const deleteClientBtn = document.getElementById('deleteClientBtn');
    const clientNameInput = document.getElementById('clientName');

    // Constants for pricing
    const PRICES = {
        basePrice: 2999,
        actionsPer100k: 129,
        unlimitedUsers: 2000,
        additionalUser: 190,
        rawDataRetention: {
            180: 0,
            270: 250,
            365: 500,
            400: 750
        },
        aggregatedDataRetention: {
            24: 0,
            36: 50,
            48: 100,
            60: 150
        }
    };

    // Client data management
    let clients = {};
    
    // Load clients from digitalist-clients.json
    function loadClientsFromJSON() {
        console.log('Attempting to load clients from digitalist-clients.json');
        
        fetch('./digitalist-clients.json')
            .then(response => {
                console.log('Fetch response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to load clients data. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully loaded client data:', data);
                clients = data;
                populateClientDropdown();
            })
            .catch(error => {
                console.error('Error loading clients:', error);
                // Try alternative path
                console.log('Trying alternative file path...');
                fetch('/digitalist-clients.json')
                    .then(response => {
                        console.log('Alternative fetch response status:', response.status);
                        if (!response.ok) {
                            throw new Error('Failed with alternative path too');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Successfully loaded client data from alternative path');
                        clients = data;
                        populateClientDropdown();
                    })
                    .catch(alternativeError => {
                        console.error('Error with alternative path:', alternativeError);
                        console.log('Checking for preloaded client data...');
                        
                        // Use preloaded data if available
                        if (window.preloadedClients) {
                            console.log('Using preloaded client data');
                            clients = window.preloadedClients;
                            populateClientDropdown();
                            return;
                        }
                        
                        // Fallback to localStorage if JSON file fails to load
                        console.log('Falling back to localStorage');
                        clients = JSON.parse(localStorage.getItem('digitalistClients') || '{}');
                        populateClientDropdown();
                    });
            });
    }

    function saveClientData() {
        const clientName = clientNameInput.value.trim();
        const clientOrgNumber = document.getElementById('clientOrgNumber').value.trim();
        
        if (!clientName || !clientOrgNumber) {
            alert('Both Client Name and Organization Number are required');
            return;
        }

        // Check if the org number exists but is associated with a different client
        for (const key in clients) {
            if (clients[key].clientOrgNumber === clientOrgNumber && 
                clients[key].clientName !== clientName) {
                alert(`Organization number ${clientOrgNumber} is already associated with client ${clients[key].clientName}`);
                return;
            }
        }

        const formData = {
            clientName: clientName,
            clientOrgNumber: clientOrgNumber,
            clientAddress: document.getElementById('clientAddress').value,
            clientContactPerson: document.getElementById('clientContactPerson').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            clientSignatureName: document.getElementById('clientSignatureName').value,
            actionsPerMonth: parseInt(actionsSlider.value),
            rawDataRetention: rawDataRetention.value,
            aggregatedDataRetention: aggregatedDataRetention.value,
            unlimitedUsers: unlimitedUsersCheckbox.checked,
            additionalUsers: unlimitedUsersCheckbox.checked ? 0 : parseInt(additionalUsersInput.value),
            startDate: startDateInput.value,
            endDate: endDateInput.value
        };

        // Use org number as the key in the clients object
        clients[clientOrgNumber] = formData;
        
        // Save to localStorage
        localStorage.setItem('digitalistClients', JSON.stringify(clients));
        
        // Create/update clients.json download link
        createOrUpdateDownloadLink();
        
        // Update dropdown
        populateClientDropdown();
        
        // Select the current client
        savedClientsDropdown.value = clientOrgNumber;
        deleteClientBtn.disabled = false;
    }

    // Create a download link for the clients data
    function createOrUpdateDownloadLink() {
        // Create a JSON blob with the clients data
        const clientsBlob = new Blob([JSON.stringify(clients, null, 2)], {type: 'application/json'});
        
        // Create a download link if it doesn't exist
        let downloadLink = document.getElementById('downloadClientsLink');
        if (!downloadLink) {
            downloadLink = document.createElement('a');
            downloadLink.id = 'downloadClientsLink';
            downloadLink.className = 'download-link';
            downloadLink.innerHTML = 'Download clients.json';
            downloadLink.setAttribute('download', 'digitalist-clients.json');
            
            // Add to document
            const container = document.querySelector('.client-selector-controls');
            container.appendChild(downloadLink);
        }
        
        // Update the URL
        const url = URL.createObjectURL(clientsBlob);
        downloadLink.setAttribute('href', url);
        
        console.log('Created download link for clients.json');
    }

    function deleteClientData() {
        const clientKey = savedClientsDropdown.value;
        if (!clientKey) return;
        
        const clientName = clients[clientKey].clientName;
        if (confirm(`Are you sure you want to delete the client "${clientName}"?`)) {
            delete clients[clientKey];
            
            // Update localStorage
            localStorage.setItem('digitalistClients', JSON.stringify(clients));
            
            // Update download link
            createOrUpdateDownloadLink();
            
            // Update dropdown
            populateClientDropdown();
            
            // Reset form
            form.reset();
            updatePriceSummary();
            deleteClientBtn.disabled = true;
        }
    }

    function populateClientDropdown() {
        const clientKeys = Object.keys(clients);
        
        // Clear dropdown except for first option
        while (savedClientsDropdown.options.length > 1) {
            savedClientsDropdown.remove(1);
        }
        
        // Add client options
        clientKeys.forEach(clientKey => {
            const option = document.createElement('option');
            option.value = clientKey;
            option.textContent = clients[clientKey].clientName;
            savedClientsDropdown.appendChild(option);
        });
    }

    // Event listeners for client data management
    savedClientsDropdown.addEventListener('change', () => {
        const selectedClient = savedClientsDropdown.value;
        if (selectedClient) {
            loadClientData(selectedClient);
            deleteClientBtn.disabled = false;
        } else {
            // Reset form if "Select a client" is chosen
            form.reset();
            updatePriceSummary();
            deleteClientBtn.disabled = true;
        }
    });

    deleteClientBtn.addEventListener('click', deleteClientData);

    // Initialize client dropdown
    loadClientsFromJSON();
    
    // Create initial download link
    setTimeout(() => {
        createOrUpdateDownloadLink();
    }, 1000);

    // Utility functions
    function formatLargeNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    function formatPriceLabel(key) {
        const labels = {
            base: 'Base Price (500k actions, 3 users)',
            actions: 'Additional Actions',
            users: 'Additional Users',
            rawData: 'Raw Data Retention',
            aggregatedData: 'Aggregated Data Retention'
        };
        return labels[key] || key;
    }

    function getNextMonday() {
        const today = new Date();
        const nextMonday = new Date(today);
        const daysUntilMonday = (8 - today.getDay()) % 7;
        nextMonday.setDate(today.getDate() + daysUntilMonday);
        return nextMonday.toISOString().split('T')[0];
    }

    function getFirstDayNextMonth() {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return nextMonth.toISOString().split('T')[0];
    }

    // Price calculation functions
    function calculateActionsPrice() {
        const additionalActions = parseInt(actionsSlider.value);
        const additionalChunks = Math.ceil(additionalActions / 100000);
        return additionalChunks * PRICES.actionsPer100k;
    }

    function calculateUsersPrice() {
        if (unlimitedUsersCheckbox.checked) {
            return PRICES.unlimitedUsers;
        }
        const additionalUsers = parseInt(additionalUsersInput.value) || 0;
        return additionalUsers * PRICES.additionalUser;
    }

    function calculateRawDataPrice() {
        const days = parseInt(rawDataRetention.value);
        return PRICES.rawDataRetention[days] || 0;
    }

    function calculateAggregatedDataPrice() {
        const months = parseInt(aggregatedDataRetention.value);
        return PRICES.aggregatedDataRetention[months] || 0;
    }

    // Main price update function
    function updatePriceSummary() {
        const prices = {
            base: PRICES.basePrice,
            actions: calculateActionsPrice(),
            users: calculateUsersPrice(),
            rawData: calculateRawDataPrice(),
            aggregatedData: calculateAggregatedDataPrice()
        };

        priceBreakdown.innerHTML = Object.entries(prices)
            .filter(([_, value]) => value > 0)
            .map(([key, value]) => `
                <div class="price-item">
                    <span>${formatPriceLabel(key)}</span>
                    <span>${value.toLocaleString()} SEK</span>
                </div>
            `).join('');

        const total = Object.values(prices).reduce((sum, price) => sum + price, 0);
        totalPriceElement.textContent = total.toLocaleString();
    }

    function updateUsersValue() {
        const additionalUsers = parseInt(additionalUsersInput.value);
        const totalUsers = 3 + additionalUsers;
        usersValue.textContent = totalUsers;
    }

    function updateEndDate() {
        // This function can be removed or kept empty since we're not calculating end date
    }

    // Initialize form
    function initializeForm() {
        startDateInput.value = getFirstDayNextMonth();
        updatePriceSummary();
    }

    // Event listeners
    actionsSlider.addEventListener('input', (e) => {
        const totalActions = 500000 + parseInt(e.target.value);
        actionsValue.textContent = formatLargeNumber(totalActions);
        updatePriceSummary();
    });

    unlimitedUsersCheckbox.addEventListener('change', (e) => {
        additionalUsersInput.disabled = e.target.checked;
        if (e.target.checked) {
            additionalUsersInput.value = 0;
            usersValue.textContent = 'Unlimited';
        } else {
            updateUsersValue();
        }
        updatePriceSummary();
    });

    additionalUsersInput.addEventListener('input', () => {
        updateUsersValue();
        updatePriceSummary();
    });

    rawDataRetention.addEventListener('change', updatePriceSummary);
    aggregatedDataRetention.addEventListener('change', updatePriceSummary);
    startDateInput.addEventListener('change', updateEndDate);

    function generateAgreementPreview(formData) {
        // Get the template from the HTML
        const templateElement = document.getElementById('agreementTemplate');
        if (!templateElement) {
            console.error('Agreement template not found in HTML');
            return '<div>Error: Agreement template not found</div>';
        }
        
        // Clone the template to avoid modifying the original
        const agreementPreview = templateElement.content.cloneNode(true);
        
        // Calculate pricing information
        const baseActionsIncluded = 500000;
        const extraActions = formData.actionsPerMonth - baseActionsIncluded;
        const totalUsers = formData.unlimitedUsers ? 'Unlimited' : (3 + formData.additionalUsers);
        
        const prices = {
            base: PRICES.basePrice,
            actions: calculateActionsPrice(),
            users: calculateUsersPrice(),
            rawData: calculateRawDataPrice(),
            aggregatedData: calculateAggregatedDataPrice()
        };

        const totalPrice = Object.values(prices).reduce((sum, price) => sum + price, 0);

        const rawDataText = {
            180: '180 days',
            270: '270 days',
            365: '365 days',
            400: '400 days'
        };

        const aggregatedDataText = {
            24: '24 months',
            36: '36 months',
            48: '48 months',
            60: '60 months'
        };
        
        // Update action chunks calculation
        const actionChunksElement = agreementPreview.querySelector('#actionChunks');
        if (actionChunksElement) {
            actionChunksElement.textContent = Math.ceil(extraActions / 100000);
        }
        
        // Update additional users count
        const additionalUsersCountElement = agreementPreview.querySelector('#additionalUsersCount');
        if (additionalUsersCountElement) {
            additionalUsersCountElement.textContent = formData.additionalUsers;
        }
        
        // Handle end date text
        const endDateTextElement = agreementPreview.querySelector('#endDateText');
        if (endDateTextElement) {
            if (!formData.endDate) {
                endDateTextElement.textContent = 'indefinitely';
            }
        }
        
        // Hide empty paragraphs for optional fields
        if (!formData.clientOrgNumber) {
            const orgNumberParagraph = agreementPreview.querySelector('#clientOrgNumberParagraph');
            if (orgNumberParagraph) {
                orgNumberParagraph.style.display = 'none';
            }
        }
        
        if (!formData.clientAddress) {
            const addressParagraph = agreementPreview.querySelector('#clientAddressParagraph');
            if (addressParagraph) {
                addressParagraph.style.display = 'none';
            }
        }
        
        if (!formData.clientPhone) {
            const phoneParagraph = agreementPreview.querySelector('#clientPhoneParagraph');
            if (phoneParagraph) {
                phoneParagraph.style.display = 'none';
            }
        }
        
        // Process all elements with data-agreement attributes
        const elementsWithData = agreementPreview.querySelectorAll('[data-agreement]');
        elementsWithData.forEach(element => {
            const dataType = element.getAttribute('data-agreement');
            
            switch(dataType) {
                case 'client-name':
                    element.textContent = formData.clientName;
                    break;
                case 'client-org-number':
                    element.textContent = formData.clientOrgNumber || '[Organization number not provided]';
                    break;
                case 'client-address':
                    element.textContent = formData.clientAddress || '[Address not provided]';
                    break;
                case 'client-contact-person':
                    element.textContent = formData.clientContactPerson;
                    break;
                case 'client-email':
                    element.textContent = formData.clientEmail;
                    break;
                case 'client-phone':
                    element.textContent = formData.clientPhone || '[Phone not provided]';
                    break;
                case 'client-signature-name':
                    element.textContent = formData.clientSignatureName;
                    break;
                case 'total-price':
                    element.textContent = totalPrice.toLocaleString();
                    break;
                case 'total-actions':
                    element.textContent = formatLargeNumber(formData.actionsPerMonth);
                    break;
                case 'extra-actions':
                    element.textContent = formatLargeNumber(extraActions);
                    break;
                case 'total-users':
                    element.textContent = totalUsers;
                    break;
                case 'raw-data-retention':
                    element.textContent = rawDataText[formData.rawDataRetention];
                    break;
                case 'aggregated-data-retention':
                    element.textContent = aggregatedDataText[formData.aggregatedDataRetention];
                    break;
                case 'start-date':
                    element.textContent = new Date(formData.startDate).toLocaleDateString('sv-SE');
                    break;
                case 'end-date':
                    element.textContent = formData.endDate ? new Date(formData.endDate).toLocaleDateString('sv-SE') : 'indefinitely';
                    break;
                case 'base-price':
                    element.textContent = prices.base.toLocaleString();
                    break;
                case 'actions-price':
                    element.textContent = prices.actions.toLocaleString();
                    break;
                case 'users-price':
                    element.textContent = prices.users.toLocaleString();
                    break;
                case 'raw-data-price':
                    element.textContent = prices.rawData.toLocaleString();
                    break;
                case 'aggregated-data-price':
                    element.textContent = prices.aggregatedData.toLocaleString();
                    break;
            }
        });
        
        // Handle conditional sections
        const conditionalSections = agreementPreview.querySelectorAll('[data-agreement-condition]');
        conditionalSections.forEach(section => {
            const condition = section.getAttribute('data-agreement-condition');
            let shouldDisplay = false;
            
            switch(condition) {
                case 'has-extra-actions':
                    shouldDisplay = extraActions > 0;
                    break;
                case 'has-extra-users':
                    shouldDisplay = prices.users > 0 && !formData.unlimitedUsers;
                    break;
                case 'has-unlimited-users':
                    shouldDisplay = formData.unlimitedUsers;
                    break;
                case 'has-raw-data-upgrade':
                    shouldDisplay = prices.rawData > 0;
                    break;
                case 'has-aggregated-data-upgrade':
                    shouldDisplay = prices.aggregatedData > 0;
                    break;
            }
            
            if (!shouldDisplay) {
                section.style.display = 'none';
            }
        });
        
        return agreementPreview;
    }

    function showPreviewOverlay(content, formData) {
        const overlay = document.createElement('div');
        overlay.className = 'preview-overlay';
        overlay.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h2>Agreement Preview</h2>
                    <div class="preview-actions">
                        <button class="download-btn">Download PDF</button>
                        <button class="close-btn">&times;</button>
                    </div>
                </div>
                <div class="preview-body">
                </div>
            </div>
        `;
        
        // Append the content to the preview body
        const previewBody = overlay.querySelector('.preview-body');
        previewBody.appendChild(content);

        document.body.appendChild(overlay);

        // Add event listeners
        const closeBtn = overlay.querySelector('.close-btn');
        const downloadBtn = overlay.querySelector('.download-btn');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        downloadBtn.addEventListener('click', () => {
            // Extract data from the form
            const clientName = formData.clientName;
            const startDate = new Date(formData.startDate);
            
            // Extract year from start date and sanitize client name for filename
            const contractYear = startDate.getFullYear();
            const sanitizedClientName = clientName
                .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .toLowerCase();
            
            // Create PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set font
            doc.setFont('helvetica');
            
            // Get the preview content from the overlay
            const previewContent = overlay.querySelector('.preview-body .agreement-preview');
            
            // Process the document content
            let yPos = 20;
            
            // Add title
            const titleElement = previewContent.querySelector('[data-pdf-title="true"]');
            if (titleElement) {
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text(titleElement.textContent, 105, yPos, { align: 'center' });
                yPos += 20;
            }
            
            // Find all sections in the agreement
            const agreementSections = previewContent.querySelectorAll('section[data-pdf-section]');
            
            // Process each section
            agreementSections.forEach(section => {
                // Skip sections that are hidden
                if (section.style.display === 'none') return;
                
                // Check if we need a new page
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                const sectionName = section.getAttribute('data-pdf-section');
                
                // Force new page for some sections
                if (sectionName === 'parties' || sectionName === 'definitions' || sectionName === 'services') {
                    // Only add a page break if we're not already at the top of a page
                    if (yPos > 30) {
                        doc.addPage();
                        yPos = 20;
                    }
                }
                
                // Section heading
                const heading = section.querySelector('h2, h3');
                if (heading) {
                    doc.setFontSize(heading.tagName === 'H2' ? 16 : 14);
                    doc.setFont('helvetica', 'bold');
                    doc.text(heading.textContent, 20, yPos);
                    yPos += 10;
                }
                
                // Special handling for parties section
                if (sectionName === 'parties') {
                    // First handle the introduction paragraph
                    const introParagraph = section.querySelector('p:first-of-type');
                    if (introParagraph) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        const lines = doc.splitTextToSize(introParagraph.textContent, 170);
                        doc.text(lines, 20, yPos);
                        yPos += lines.length * 6 + 8; // Add extra space after intro
                    }
                    
                    // Handle client section
                    const clientHeading = section.querySelector('h3:first-of-type');
                    if (clientHeading) {
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text(clientHeading.textContent, 20, yPos);
                        yPos += 8;
                    }
                    
                    // Client details
                    const clientOrgNumber = section.querySelector('[data-agreement="client-org-number"]');
                    const clientAddress = section.querySelector('[data-agreement="client-address"]');
                    
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'normal');
                    
                    if (clientOrgNumber && clientOrgNumber.parentElement.style.display !== 'none') {
                        doc.text(`Org.nr: ${clientOrgNumber.textContent}`, 20, yPos);
                        yPos += 6;
                    }
                    
                    if (clientAddress && clientAddress.parentElement.style.display !== 'none') {
                        const addressLines = doc.splitTextToSize(`Address: ${clientAddress.textContent}`, 170);
                        doc.text(addressLines, 20, yPos);
                        yPos += addressLines.length * 6;
                    }
                    
                    yPos += 8; // Add space between client and supplier
                    
                    // Handle supplier section
                    const supplierHeading = section.querySelector('h3:nth-of-type(2)');
                    if (supplierHeading) {
                        doc.setFontSize(14);
                        doc.setFont('helvetica', 'bold');
                        doc.text(supplierHeading.textContent, 20, yPos);
                        yPos += 8;
                    }
                    
                    // Supplier details - split by <br> tags
                    const supplierDetails = section.querySelector('h3:nth-of-type(2) + p');
                    if (supplierDetails) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        // Extract text content and split by <br> tags
                        const detailsHTML = supplierDetails.innerHTML;
                        const detailsArray = detailsHTML.split('<br>');
                        
                        detailsArray.forEach(detail => {
                            // Remove any HTML tags that might remain
                            const cleanDetail = detail.replace(/<[^>]*>/g, '').trim();
                            if (cleanDetail) {
                                const detailLines = doc.splitTextToSize(cleanDetail, 170);
                                doc.text(detailLines, 20, yPos);
                                yPos += detailLines.length * 6;
                            }
                        });
                    }
                    
                    yPos += 10; // Add extra space after parties section
                    
                    // Skip the default paragraph processing for this section
                    return;
                }
                
                // Special handling for definitions section
                if (sectionName === 'definitions') {
                    // First handle the paragraph elements
                    const paragraphs = section.querySelectorAll('p');
                    
                    if (paragraphs.length > 0) {
                        doc.setFontSize(11);
                        
                        paragraphs.forEach(paragraph => {
                            // Extract terms and definitions with proper formatting
                            const text = paragraph.innerHTML;
                            
                            // Check if the paragraph contains a <strong> element
                            if (text.includes('<strong>')) {
                                // Split by <strong> tags to identify definition terms
                                const parts = text.split(/<\/?strong>/g).filter(part => part.trim());
                                
                                let currentLine = '';
                                let boldPart = true; // Track if we're handling a bold part
                                
                                for (let i = 0; i < parts.length; i++) {
                                    const part = parts[i].trim().replace(/<br>/g, '');
                                    
                                    if (part.length === 0) continue;
                                    
                                    if (boldPart) {
                                        // Handle term (bold part)
                                        doc.setFont('helvetica', 'bold');
                                        currentLine = part;
                                        
                                        // If next part is a definition, continue to next iteration
                                        if (i < parts.length - 1 && parts[i+1].includes(':')) {
                                            boldPart = !boldPart;
                                            continue;
                                        }
                                        
                                        // If no definition follows, print just the term
                                        const lines = doc.splitTextToSize(currentLine, 170);
                                        doc.text(lines, 20, yPos);
                                        yPos += lines.length * 6 + 2;
                                    } else {
                                        // Handle definition (normal part)
                                        doc.setFont('helvetica', 'normal');
                                        
                                        // Split the definition by potential <br> tags
                                        const definitionParts = part.split('<br>').map(p => p.trim()).filter(p => p);
                                        
                                        for (const defPart of definitionParts) {
                                            // Clean any remaining HTML
                                            const cleanText = defPart.replace(/<[^>]*>/g, '').trim();
                                            
                                            if (cleanText) {
                                                const lines = doc.splitTextToSize(cleanText, 170);
                                                doc.text(lines, 20, yPos);
                                                yPos += lines.length * 6 + 2;
                                            }
                                        }
                                    }
                                    
                                    boldPart = !boldPart;
                                }
                            } else {
                                // Regular paragraph without definition terms
                                doc.setFont('helvetica', 'normal');
                                const cleanText = paragraph.textContent.trim();
                                
                                if (cleanText) {
                                    const lines = doc.splitTextToSize(cleanText, 170);
                                    doc.text(lines, 20, yPos);
                                    yPos += lines.length * 6 + 3;
                                }
                            }
                        });
                    }
                    
                    // Add space after the definitions section
                    yPos += 5;
                    
                    // Skip the default paragraph processing
                    return;
                }
                
                // Special handling for signature section
                if (sectionName === 'signatures') {
                    const signatureBlocks = section.querySelectorAll('.signature-block');
                    
                    if (signatureBlocks.length === 2) {
                        // Get text content from each signature block
                        const clientSignature = [];
                        const companySignature = [];
                        
                        // Process first signature block (client)
                        Array.from(signatureBlocks[0].childNodes)
                            .filter(node => node.nodeType === 1) // Only element nodes
                            .forEach(node => {
                                if (node.textContent.trim()) {
                                    clientSignature.push(node.textContent.trim());
                                }
                            });
                        
                        // Process second signature block (company)
                        Array.from(signatureBlocks[1].childNodes)
                            .filter(node => node.nodeType === 1) // Only element nodes
                            .forEach(node => {
                                if (node.textContent.trim()) {
                                    companySignature.push(node.textContent.trim());
                                }
                            });
                        
                        // Draw two-column signature section
                        const leftCol = 20;
                        const rightCol = 105;
                        let sigYPos = yPos + 5;
                        
                        // Draw lines for each part, matching them side by side
                        const maxLines = Math.max(clientSignature.length, companySignature.length);
                        
                        for (let i = 0; i < maxLines; i++) {
                            if (clientSignature[i]) {
                                doc.setFont(i === 0 ? 'helvetica-bold' : 'helvetica');
                                doc.setFontSize(12);
                                doc.text(clientSignature[i], leftCol, sigYPos);
                            }
                            
                            if (companySignature[i]) {
                                doc.setFont(i === 0 ? 'helvetica-bold' : 'helvetica');
                                doc.setFontSize(12);
                                doc.text(companySignature[i], rightCol, sigYPos);
                            }
                            
                            sigYPos += 7;
                        }
                        
                        // Add signature lines
                        sigYPos += 10;
                        doc.line(leftCol, sigYPos, leftCol + 70, sigYPos);
                        doc.line(rightCol, sigYPos, rightCol + 70, sigYPos);
                        
                        sigYPos += 7;
                        doc.text("Signature", leftCol, sigYPos);
                        doc.text("Signature", rightCol, sigYPos);
                        
                        yPos = sigYPos + 15;
                        
                        // Skip the rest of the processing for this section
                        return;
                    }
                }
                
                // Special handling for appendices section to add hyperlinks
                if (sectionName === 'appendices') {
                    // First handle the heading and opening paragraph normally
                    const paragraphs = section.querySelectorAll('p');
                    if (paragraphs.length > 0) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        // Only process the first paragraph
                        const firstParagraph = paragraphs[0];
                        if (firstParagraph) {
                            const lines = doc.splitTextToSize(firstParagraph.textContent.trim(), 170);
                            doc.text(lines, 20, yPos);
                            yPos += lines.length * 6 + 5;
                        }
                    }
                    
                    // Process the list items with links
                    const listItems = section.querySelectorAll('ul li');
                    
                    if (listItems.length > 0) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        // Document links and titles
                        const documents = [
                            { title: "The Agreement (this document)", url: "" },
                            { title: "Special Terms Cloud Services Personal Data", url: "https://drive.google.com/file/d/1WCPgFhq4eZoCpdg2SENo3VechAld6_hZ/view?usp=sharing" },
                            { title: "General Terms Cloud Services", url: "https://drive.google.com/file/d/1MxZN22D3DZ5DuPBH3UyqU8TiB0iQy8ni/view?usp=sharing" },
                            { title: "Business Ethics Principles", url: "https://drive.google.com/file/d/1yJgnaX3fE4FS_l8t9ookSjcCBusQa3QL/view?usp=sharing" }
                        ];
                        
                        // Add each document as a bullet point, with links when available
                        documents.forEach((docItem, index) => {
                            const bulletText = `• ${docItem.title}`;
                            doc.text(bulletText, 20, yPos);
                            
                            // Add clickable link if URL is provided
                            if (docItem.url) {
                                // Calculate the text width to position the link correctly
                                const textWidth = doc.getTextWidth(bulletText);
                                // Add link annotation (clickable area)
                                doc.link(20, yPos - 5, textWidth, 10, { url: docItem.url });
                                // Underline the text to indicate it's a link
                                doc.setDrawColor(0, 0, 255); // Blue color for links
                                doc.line(20, yPos + 2, 20 + textWidth, yPos + 2);
                            }
                            
                            yPos += 8;
                        });
                        
                        // Add space after list
                        yPos += 5;
                    }
                    
                    // Process the concluding paragraphs
                    if (paragraphs.length > 1) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        // Process all paragraphs except the first one
                        for (let i = 1; i < paragraphs.length; i++) {
                            const lines = doc.splitTextToSize(paragraphs[i].textContent.trim(), 170);
                            doc.text(lines, 20, yPos);
                            yPos += lines.length * 6 + 3;
                        }
                    }
                    
                    // Skip the default paragraph and list processing for this section
                    return;
                }
                
                // Tables (special handling for cost breakdown)
                if (sectionName === 'cost-breakdown') {
                    // Completely manual approach - draw our own table
                    console.log("Drawing cost breakdown table manually");
                    
                    // Reset any previous colors
                    doc.setDrawColor(0, 0, 0);
                    doc.setFillColor(240, 240, 240);
                    doc.setTextColor(0, 0, 0);
                    
                    // Calculate all prices directly
                    const basePrice = PRICES.basePrice;
                    const extraActions = formData.actionsPerMonth - 500000;
                    const actionsPrice = Math.ceil(extraActions / 100000) * PRICES.actionsPer100k;
                    
                    let usersPrice = 0;
                    if (formData.unlimitedUsers) {
                        usersPrice = PRICES.unlimitedUsers;
                    } else if (formData.additionalUsers > 0) {
                        usersPrice = formData.additionalUsers * PRICES.additionalUser;
                    }
                    
                    const rawDataPrice = PRICES.rawDataRetention[formData.rawDataRetention] || 0;
                    const aggregatedDataPrice = PRICES.aggregatedDataRetention[formData.aggregatedDataRetention] || 0;
                    
                    const totalPrice = basePrice + actionsPrice + usersPrice + rawDataPrice + aggregatedDataPrice;
                    
                    // Prepare table data
                    const tableData = [];
                    
                    // Always add base price row
                    tableData.push({
                        item: "Base Price",
                        description: "500k actions + 3 users",
                        cost: basePrice.toLocaleString()
                    });
                    
                    // Add additional rows based on selections
                    if (extraActions > 0) {
                        tableData.push({
                            item: "Additional Actions",
                            description: `${formatLargeNumber(extraActions)} extra actions (${Math.ceil(extraActions / 100000)} × 100k chunks)`,
                            cost: actionsPrice.toLocaleString()
                        });
                    }
                    
                    if (formData.unlimitedUsers) {
                        tableData.push({
                            item: "Unlimited Users",
                            description: "Unlimited user accounts",
                            cost: usersPrice.toLocaleString()
                        });
                    } else if (formData.additionalUsers > 0) {
                        tableData.push({
                            item: "Additional Users",
                            description: `${formData.additionalUsers} extra users (@ 190 SEK each)`,
                            cost: usersPrice.toLocaleString()
                        });
                    }
                    
                    if (rawDataPrice > 0) {
                        const rawDataText = {
                            180: '180 days',
                            270: '270 days',
                            365: '365 days',
                            400: '400 days'
                        };
                        
                        tableData.push({
                            item: "Raw Data Retention",
                            description: `${rawDataText[formData.rawDataRetention]} (upgrade from 180 days)`,
                            cost: rawDataPrice.toLocaleString()
                        });
                    }
                    
                    if (aggregatedDataPrice > 0) {
                        const aggregatedDataText = {
                            24: '24 months',
                            36: '36 months',
                            48: '48 months',
                            60: '60 months'
                        };
                        
                        tableData.push({
                            item: "Aggregated Data Retention",
                            description: `${aggregatedDataText[formData.aggregatedDataRetention]} (upgrade from 24 months)`,
                            cost: aggregatedDataPrice.toLocaleString()
                        });
                    }
                    
                    // Table dimensions
                    const startX = 20;
                    const columnWidths = [50, 90, 40];  // Width of each column
                    const rowHeight = 12; // Increase row height slightly
                    const padding = 3;
                    
                    // Set starting position
                    let currentY = yPos + 5;
                    
                    // Check if we need a new page
                    if (currentY + (tableData.length + 2) * rowHeight > 270) {
                        doc.addPage();
                        currentY = 20;
                    }
                    
                    // Draw header row
                    doc.setFillColor(44, 90, 160);
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    
                    // Draw full header background
                    doc.rect(startX, currentY, columnWidths[0] + columnWidths[1] + columnWidths[2], rowHeight, 'F');
                    
                    // Draw header cells with borders
                    let xPos = startX;
                    
                    // "Item" header
                    doc.rect(xPos, currentY, columnWidths[0], rowHeight, 'S');
                    doc.text('Item', xPos + padding, currentY + (rowHeight/2) + 1);
                    
                    // "Description" header
                    xPos += columnWidths[0];
                    doc.rect(xPos, currentY, columnWidths[1], rowHeight, 'S');
                    doc.text('Description', xPos + padding, currentY + (rowHeight/2) + 1);
                    
                    // "Cost (SEK)" header - right aligned
                    xPos += columnWidths[1];
                    doc.rect(xPos, currentY, columnWidths[2], rowHeight, 'S');
                    const costText = 'Cost (SEK)';
                    const costWidth = doc.getTextWidth(costText);
                    doc.text(costText, xPos + columnWidths[2] - costWidth - padding, currentY + (rowHeight/2) + 1);
                    
                    currentY += rowHeight;
                    
                    // Draw data rows
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'normal');
                    
                    tableData.forEach((row, index) => {
                        // Alternating row colors
                        if (index % 2 === 0) {
                            doc.setFillColor(255, 255, 255);
                        } else {
                            doc.setFillColor(249, 249, 249);
                        }
                        
                        // Draw row background
                        doc.rect(startX, currentY, columnWidths[0] + columnWidths[1] + columnWidths[2], rowHeight, 'F');
                        
                        // Draw cell borders
                        doc.setDrawColor(220, 220, 220);
                        
                        // Item column
                        xPos = startX;
                        doc.rect(xPos, currentY, columnWidths[0], rowHeight, 'S');
                        doc.text(row.item, xPos + padding, currentY + (rowHeight/2) + 1);
                        
                        // Description column
                        xPos += columnWidths[0];
                        doc.rect(xPos, currentY, columnWidths[1], rowHeight, 'S');
                        
                        // Handle long descriptions
                        const descLines = doc.splitTextToSize(row.description, columnWidths[1] - (padding * 2));
                        doc.text(descLines, xPos + padding, currentY + (rowHeight/2) - (((descLines.length - 1) * 4) / 2) + 1);
                        
                        // Cost column - right aligned
                        xPos += columnWidths[1];
                        doc.rect(xPos, currentY, columnWidths[2], rowHeight, 'S');
                        const costValueWidth = doc.getTextWidth(row.cost);
                        doc.text(row.cost, xPos + columnWidths[2] - costValueWidth - padding, currentY + (rowHeight/2) + 1);
                        
                        currentY += rowHeight;
                    });
                    
                    // Draw total row
                    doc.setFillColor(240, 247, 255);
                    doc.setTextColor(44, 90, 160);
                    doc.setFont('helvetica', 'bold');
                    
                    // Draw total row background
                    doc.rect(startX, currentY, columnWidths[0] + columnWidths[1] + columnWidths[2], rowHeight, 'F');
                    
                    // Draw total cells
                    xPos = startX;
                    doc.rect(xPos, currentY, columnWidths[0], rowHeight, 'S');
                    doc.text('TOTAL MONTHLY COST', xPos + padding, currentY + (rowHeight/2) + 1);
                    
                    xPos += columnWidths[0];
                    doc.rect(xPos, currentY, columnWidths[1], rowHeight, 'S');
                    
                    xPos += columnWidths[1];
                    doc.rect(xPos, currentY, columnWidths[2], rowHeight, 'S');
                    
                    // Right-align the total price
                    const totalText = `${totalPrice.toLocaleString()} SEK`;
                    const totalWidth = doc.getTextWidth(totalText);
                    doc.text(totalText, xPos + columnWidths[2] - totalWidth - padding, currentY + (rowHeight/2) + 1);
                    
                    // Update position for next section
                    yPos = currentY + rowHeight + 15;
                    
                    // Reset colors to default
                    doc.setDrawColor(0, 0, 0);
                    doc.setFillColor(255, 255, 255);
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'normal');
                    
                    // Skip the default paragraph and list processing for this section
                    return;
                }
                
                // Paragraphs (except for specification section)
                if (sectionName !== 'specification') {
                    const paragraphs = section.querySelectorAll('p');
                    if (paragraphs.length > 0) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        paragraphs.forEach(paragraph => {
                            // Skip hidden paragraphs
                            if (paragraph.style.display === 'none') return;
                            
                            // Check if a new page is needed
                            if (yPos > 270) {
                                doc.addPage();
                                yPos = 20;
                            }
                            
                            const lines = doc.splitTextToSize(paragraph.textContent.trim(), 170);
                            doc.text(lines, 20, yPos);
                            yPos += lines.length * 6 + 2;
                        });
                    }
                }
                
                // Lists - Special handling for nested lists
                if (sectionName === 'specification') {
                    // For specification section, completely rewrite the handling
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'normal');
                    
                    // Handle the Monthly Fee line directly from the preview
                    const monthlyFeeElement = section.querySelector('p strong');
                    if (monthlyFeeElement) {
                        const feeText = monthlyFeeElement.textContent.trim();
                        doc.text(feeText, 20, yPos);
                        yPos += 8;
                    }
                    
                    // Manually create the specification list to avoid duplication issues
                    const actionsElement = section.querySelector('[data-agreement="total-actions"]');
                    if (actionsElement) {
                        doc.text(`• Including ${actionsElement.textContent} actions per month`, 20, yPos);
                        yPos += 8;
                    }
                    
                    const usersElement = section.querySelector('[data-agreement="total-users"]');
                    if (usersElement) {
                        doc.text(`• ${usersElement.textContent} user accounts (in Matomo)`, 20, yPos);
                        yPos += 8;
                    }
                    
                    // Add the data retention section header
                    doc.text(`• Agreed data retention:`, 20, yPos);
                    yPos += 8;
                    
                    // Add nested retention items with proper indentation
                    const rawDataElement = section.querySelector('[data-agreement="raw-data-retention"]');
                    if (rawDataElement) {
                        doc.text(`    • Matomo Logs: ${rawDataElement.textContent}`, 20, yPos);
                        yPos += 8;
                    }
                    
                    const aggregatedDataElement = section.querySelector('[data-agreement="aggregated-data-retention"]');
                    if (aggregatedDataElement) {
                        doc.text(`    • Matomo Reports: ${aggregatedDataElement.textContent}`, 20, yPos);
                        yPos += 8;
                    }
                    
                    // Add the fixed RebelMetrics item
                    doc.text('    • RebelMetrics: 5 years', 20, yPos);
                    yPos += 8;
                    
                    // Add the additional requested items
                    doc.text('• Dimensions: 20 dimensions included in the base fee (10 action & 10 visitor)', 20, yPos);
                    yPos += 8;
                    
                    doc.text('• 1 GB of custom data in Superset (your own uploaded data - not Matomo data)', 20, yPos);
                    yPos += 8;
                    
                    doc.text('• 20k hits (requests) to Superset (per month)', 20, yPos);
                    yPos += 10;
                    
                } else {
                    // Normal list handling for other sections
                    const lists = section.querySelectorAll('ul');
                    if (lists.length > 0) {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        
                        lists.forEach(list => {
                            const items = list.querySelectorAll('li');
                            items.forEach(item => {
                                // Check if a new page is needed
                                if (yPos > 270) {
                                    doc.addPage();
                                    yPos = 20;
                                }
                                
                                const itemText = item.textContent.trim();
                                const itemLines = doc.splitTextToSize('• ' + itemText, 165);
                                doc.text(itemLines, 25, yPos); // Indented
                                yPos += itemLines.length * 6 + 1;
                            });
                            
                            // Add space after list
                            yPos += 3;
                        });
                    }
                }
                
                // Add extra space after section
                yPos += 10;
            });
            
            // Create filename and save
            const filename = `matomo-agreement-${sanitizedClientName}-${contractYear}.pdf`;
            doc.save(filename);
        });

        // Close on overlay click (outside content)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    function loadClientData(clientKey) {
        const clientData = clients[clientKey];
        
        if (!clientData) return;
        
        // Fill form with client data
        clientNameInput.value = clientData.clientName || '';
        document.getElementById('clientOrgNumber').value = clientData.clientOrgNumber || '';
        document.getElementById('clientAddress').value = clientData.clientAddress || '';
        document.getElementById('clientContactPerson').value = clientData.clientContactPerson || '';
        document.getElementById('clientEmail').value = clientData.clientEmail || '';
        document.getElementById('clientPhone').value = clientData.clientPhone || '';
        document.getElementById('clientSignatureName').value = clientData.clientSignatureName || '';
        
        // Handle actions slider
        actionsSlider.value = clientData.actionsPerMonth || 0;
        actionsValue.textContent = formatLargeNumber(500000 + parseInt(actionsSlider.value));
        
        // Handle data retention
        rawDataRetention.value = clientData.rawDataRetention || '180';
        aggregatedDataRetention.value = clientData.aggregatedDataRetention || '24';
        
        // Handle users
        unlimitedUsersCheckbox.checked = clientData.unlimitedUsers === true || clientData.unlimitedUsers === "true";
        additionalUsersInput.disabled = unlimitedUsersCheckbox.checked;
        
        if (!unlimitedUsersCheckbox.checked) {
            additionalUsersInput.value = clientData.additionalUsers || 0;
            usersValue.textContent = 3 + parseInt(additionalUsersInput.value);
        } else {
            additionalUsersInput.value = 0;
            usersValue.textContent = 'Unlimited';
        }
        
        // Handle dates
        startDateInput.value = clientData.startDate || getFirstDayNextMonth();
        endDateInput.value = clientData.endDate || '';
        
        // Update price summary
        updatePriceSummary();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = {
            clientName: document.getElementById('clientName').value,
            clientOrgNumber: document.getElementById('clientOrgNumber').value,
            clientAddress: document.getElementById('clientAddress').value,
            clientContactPerson: document.getElementById('clientContactPerson').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            clientSignatureName: document.getElementById('clientSignatureName').value,
            actionsPerMonth: 500000 + parseInt(actionsSlider.value),
            rawDataRetention: rawDataRetention.value,
            aggregatedDataRetention: aggregatedDataRetention.value,
            unlimitedUsers: unlimitedUsersCheckbox.checked,
            additionalUsers: unlimitedUsersCheckbox.checked ? 0 : parseInt(additionalUsersInput.value),
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            monthlyPrice: parseInt(totalPriceElement.textContent.replace(/,/g, ''))
        };

        // Save client data to localStorage
        try {
            saveClientData();
            
            // Generate agreement preview
            const agreementContent = generateAgreementPreview(formData);
            showPreviewOverlay(agreementContent, formData);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    initializeForm();
});

