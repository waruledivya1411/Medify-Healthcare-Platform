// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}));

// Login Modal
const loginBtn = document.querySelector('.login-btn');
const modal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Delivery Address Modal
const deliveryAddressSelector = document.getElementById('delivery-address-selector');
const deliveryModal = document.getElementById('delivery-address-modal');
const closeDeliveryModal = document.getElementById('close-delivery-modal');
const useCurrentLocation = document.getElementById('use-current-location');
const chooseLocation = document.getElementById('choose-location');
const selectedAddressSpan = document.getElementById('selected-address');

if (deliveryAddressSelector) {
    deliveryAddressSelector.addEventListener('click', () => {
        deliveryModal.style.display = 'block';
    });
}

if (closeDeliveryModal) {
    closeDeliveryModal.addEventListener('click', () => {
        deliveryModal.style.display = 'none';
    });
}

// Close delivery modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === deliveryModal) {
        deliveryModal.style.display = 'none';
    }
});

// Handle Current Location
if (useCurrentLocation) {
    useCurrentLocation.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    selectedAddressSpan.textContent = 'Current Location';
                    deliveryModal.style.display = 'none';
                    // You can store coordinates here: position.coords.latitude, position.coords.longitude
                },
                (error) => {
                    alert('Unable to get your location. Please choose a different location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please choose a different location.');
        }
    });
}

// Handle Choose Different Location
if (chooseLocation) {
    chooseLocation.addEventListener('click', () => {
        const address = prompt('Enter your delivery address:');
        if (address && address.trim() !== '') {
            selectedAddressSpan.textContent = address.trim();
            deliveryModal.style.display = 'none';
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#login' && href !== '#cart' && href !== '#profile') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Category Toggle
const categoryTags = document.querySelectorAll('.category-tag');
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        categoryTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    });
});

// Prescription File Upload → Firebase Storage
const PRESCRIPTION_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const PRESCRIPTION_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

function validatePrescriptionFile(file) {
    if (!file) return { valid: false, error: 'No file selected.' };
    if (!PRESCRIPTION_ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid format. Use JPG, PNG, or PDF only.' };
    }
    if (file.size > PRESCRIPTION_MAX_SIZE) {
        return { valid: false, error: 'File too large. Maximum size is 5MB.' };
    }
    return { valid: true };
}

function setUploadBoxContent(html) {
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) uploadBox.innerHTML = html;
}

function uploadPrescriptionToFirebase(file) {
    const prescriptionFileInput = document.getElementById('prescription-file');
    const validation = validatePrescriptionFile(file);
    if (!validation.valid) {
        alert(validation.error);
        if (prescriptionFileInput) prescriptionFileInput.value = '';
        return;
    }

    if (typeof firebase === 'undefined' || !window.firebaseStorage) {
        alert('Storage is not available. Please refresh the page.');
        return;
    }

    var auth = window.firebaseAuth;
    var db = window.firebaseDb;
    var user = auth ? auth.currentUser : null;
    if (!user || !user.uid) {
        alert('Please log in to upload a prescription. Our pharmacist will review it and prepare your order.');
        if (prescriptionFileInput) prescriptionFileInput.value = '';
        return;
    }

    setUploadBoxContent(`
        <i class="fas fa-spinner fa-spin" style="color: var(--primary-teal); font-size: 4rem; margin-bottom: 1rem;"></i>
        <h3>Uploading...</h3>
        <p>${file.name}</p>
    `);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `prescriptions/${user.uid}_${Date.now()}_${safeName}`;
    const storageRef = window.firebaseStorage.ref(path);
    const metadata = { contentType: file.type };

    storageRef.put(file, metadata)
        .then(function() {
            return storageRef.getDownloadURL();
        })
        .then(function(fileUrl) {
            if (!db) return;
            return db.collection('prescriptions').add({
                customerId: user.uid,
                customerEmail: user.email || '',
                customerName: user.displayName || null,
                fileUrl: fileUrl,
                fileName: file.name,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(function() {
            setUploadBoxContent(`
                <i class="fas fa-check-circle" style="color: var(--primary-teal); font-size: 4rem; margin-bottom: 1rem;"></i>
                <h3>Uploaded successfully</h3>
                <p>Our pharmacist will review your prescription and prepare your order.</p>
                <button class="btn btn-primary" onclick="document.getElementById('prescription-file').click()" style="margin-top: 1rem;">
                    Upload another
                </button>
            `);
            if (prescriptionFileInput) prescriptionFileInput.value = '';
        })
        .catch(function(err) {
            console.error('Prescription upload failed:', err);
            setUploadBoxContent(`
                <i class="fas fa-cloud-upload-alt"></i>
                <h3>Drag & Drop or Click to Upload</h3>
                <p>Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                <button class="btn btn-primary" onclick="document.getElementById('prescription-file').click()">Choose File</button>
                <p class="text-danger" style="margin-top: 0.5rem;">Upload failed. Please try again.</p>
            `);
            if (prescriptionFileInput) prescriptionFileInput.value = '';
        });
}

function handlePrescriptionFile(file) {
    if (!file || !file.type) return;
    uploadPrescriptionToFirebase(file);
}

const prescriptionFileInput = document.getElementById('prescription-file');
if (prescriptionFileInput) {
    prescriptionFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handlePrescriptionFile(file);
    });
}

// Drag & drop for prescription upload
const uploadBox = document.querySelector('.prescription-upload-area .upload-box');
if (uploadBox) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((ev) => {
        uploadBox.addEventListener(ev, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    uploadBox.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        handlePrescriptionFile(file);
    });
    uploadBox.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input')) return;
        prescriptionFileInput && prescriptionFileInput.click();
    });
}

// Cart functionality
let cart = [];

// Cart Modal
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartFooter = document.getElementById('cart-footer');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartDisplay();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
}

// Close cart modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Cart icon by product type – matches store (no tablet icon unless item is pills)
function getCartItemIcon(imageType) {
    const icons = {
        'pills': 'fas fa-pills', 'bottle': 'fas fa-wine-bottle', 'baby': 'fas fa-baby',
        'jar': 'fas fa-jar', 'device': 'fas fa-heartbeat', 'box': 'fas fa-box',
        'tube': 'fas fa-toothpaste', 'pack': 'fas fa-archive', 'kit': 'fas fa-briefcase-medical',
        'roll': 'fas fa-band-aid', 'bag': 'fas fa-shopping-bag', 'soap': 'fas fa-soap',
        'capsules': 'fas fa-capsules'
    };
    return icons[imageType] || 'fas fa-cube';
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const iconClass = getCartItemIcon(item.imageType);
            return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${iconClass}"></i>
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        }).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total;
        cartFooter.style.display = 'block';
    }
}

// Remove from cart
window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
};

// Add to cart (called from medicines page with id, name, price, type, imageType)
window.addToCart = function (item) {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            imageType: item.imageType
        });
    }
    updateCartCount();
};

// Add to Cart (button listener for product cards – skip if medicines page uses addProductToCart)
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const onclick = this.getAttribute('onclick') || '';
        if (onclick.includes('addProductToCart')) return; // medicines page handles it with imageType
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = parseInt(productCard.querySelector('.price').textContent.replace('₹', ''));

        // Check if item already in cart
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1,
                imageType: 'cube'
            });
        }

        updateCartCount();

        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.style.backgroundColor = 'var(--dark-teal)';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = 'var(--cyan-teal)';
        }, 2000);
    });
});

// Doctors Database (simulated) - Enhanced with Indian names for all categories - Make globally accessible
window.doctorsDatabase = {
    "General Medicine": [
        { id: 1, name: "Dr. Priya Sharma", specialty: "General Physician", rating: 4.9, experience: 15, experienceText: "15 YEARS", credentials: "MBBS, MD (General Medicine)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 500, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 2, name: "Dr. Rajesh Kumar", specialty: "General Physician", rating: 4.8, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MD (Internal Medicine)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 450, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 3, name: "Dr. Anjali Singh", specialty: "General Physician", rating: 4.7, experience: 10, experienceText: "10 YEARS", credentials: "MBBS, MD (General Medicine)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 400, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English"] },
        { id: 4, name: "Dr. Vikram Patel", specialty: "General Physician", rating: 4.6, experience: 8, experienceText: "8 YEARS", credentials: "MBBS, MD", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 350, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 101, name: "Dr. Ramesh Iyer", specialty: "General Physician", rating: 4.8, experience: 14, experienceText: "14 YEARS", credentials: "MBBS, MD (General Medicine)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 480, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 102, name: "Dr. Meera Nair", specialty: "General Physician", rating: 4.7, experience: 11, experienceText: "11 YEARS", credentials: "MBBS, MD", location: "Kochi", clinic: "Medify Clinic - Kerala, Kochi", price: 420, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 103, name: "Dr. Suresh Reddy", specialty: "General Physician", rating: 4.6, experience: 9, experienceText: "9 YEARS", credentials: "MBBS, MD (Internal Medicine)", location: "Hyderabad", clinic: "Medify Clinic - Telangana, Hyderabad", price: 380, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English", "Hindi"] },
        { id: 104, name: "Dr. Geeta Malhotra", specialty: "General Physician", rating: 4.8, experience: 13, experienceText: "13 YEARS", credentials: "MBBS, MD (General Medicine)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 470, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 105, name: "Dr. Karthik Nambiar", specialty: "General Physician", rating: 4.7, experience: 10, experienceText: "10 YEARS", credentials: "MBBS, MD", location: "Thiruvananthapuram", clinic: "Medify Clinic - Kerala, Thiruvananthapuram", price: 410, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 106, name: "Dr. Swati Joshi", specialty: "General Physician", rating: 4.6, experience: 7, experienceText: "7 YEARS", credentials: "MBBS, MD (Internal Medicine)", location: "Ahmedabad", clinic: "Medify Clinic - Gujarat, Ahmedabad", price: 370, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English", "Hindi"] }
    ],
    "Cardiology": [
        { id: 5, name: "Dr. Sanjay Mehta", specialty: "Cardiologist", rating: 4.9, experience: 20, experienceText: "20 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 800, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 6, name: "Dr. Neha Gupta", specialty: "Cardiologist", rating: 4.8, experience: 18, experienceText: "18 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 750, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 7, name: "Dr. Amit Desai", specialty: "Cardiologist", rating: 4.7, experience: 15, experienceText: "15 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 700, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English"] },
        { id: 8, name: "Dr. Kavita Reddy", specialty: "Cardiologist", rating: 4.6, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MD, DM", location: "Hyderabad", clinic: "Medify Clinic - Telangana, Hyderabad", price: 650, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 114, name: "Dr. Ashok Menon", specialty: "Cardiologist", rating: 4.9, experience: 22, experienceText: "22 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 850, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 115, name: "Dr. Deepika Ramesh", specialty: "Cardiologist", rating: 4.8, experience: 16, experienceText: "16 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Pune", clinic: "Medify Clinic - Maharashtra, Pune", price: 720, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 116, name: "Dr. Ravi Shankar", specialty: "Cardiologist", rating: 4.8, experience: 17, experienceText: "17 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Kolkata", clinic: "Medify Clinic - West Bengal, Kolkata", price: 730, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 117, name: "Dr. Sarika Pawar", specialty: "Cardiologist", rating: 4.7, experience: 14, experienceText: "14 YEARS", credentials: "MBBS, MD, DM (Cardiology)", location: "Nagpur", clinic: "Medify Clinic - Maharashtra, Nagpur", price: 680, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] }
    ],
    "Dermatology": [
        { id: 9, name: "Dr. Ritika Shanmugam", specialty: "Dermatologist", rating: 4.9, experience: 9, experienceText: "9 YEARS", credentials: "MBBS, MD (Dermatology, Venereology & Leprosy)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 760, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 10, name: "Dr. Usha B K", specialty: "Dermatologist", rating: 4.8, experience: 4, experienceText: "4 YEARS", credentials: "MBBS, MD (Dermatology, Venereology)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 660, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 11, name: "Dr. Hemalatha Naidu M", specialty: "Dermatologist", rating: 4.7, experience: 7, experienceText: "7 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 660, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English"] },
        { id: 12, name: "Dr. Sneha Iyer", specialty: "Dermatologist", rating: 4.9, experience: 14, experienceText: "14 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 600, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 118, name: "Dr. Kavita Deshmukh", specialty: "Dermatologist", rating: 4.8, experience: 11, experienceText: "11 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Pune", clinic: "Medify Clinic - Maharashtra, Pune", price: 680, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 119, name: "Dr. Praveen Nair", specialty: "Dermatologist", rating: 4.7, experience: 8, experienceText: "8 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 620, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English", "Hindi"] },
        { id: 120, name: "Dr. Aarti Mehta", specialty: "Dermatologist", rating: 4.9, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Ahmedabad", clinic: "Medify Clinic - Gujarat, Ahmedabad", price: 720, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 121, name: "Dr. Vijayalakshmi Ramachandran", specialty: "Dermatologist", rating: 4.8, experience: 10, experienceText: "10 YEARS", credentials: "MBBS, MD (Dermatology)", location: "Coimbatore", clinic: "Medify Clinic - Tamil Nadu, Coimbatore", price: 640, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] }
    ],
    "Pediatrics": [
        { id: 13, name: "Dr. Shilpa Agarwal", specialty: "Pediatrician", rating: 4.9, experience: 16, experienceText: "16 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 550, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 14, name: "Dr. Rohit Shah", specialty: "Pediatrician", rating: 4.8, experience: 13, experienceText: "13 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 500, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 15, name: "Dr. Divya Rao", specialty: "Pediatrician", rating: 4.7, experience: 10, experienceText: "10 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 450, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English"] },
        { id: 16, name: "Dr. Arjun Chawla", specialty: "Pediatrician", rating: 4.6, experience: 8, experienceText: "8 YEARS", credentials: "MBBS, MD", location: "Pune", clinic: "Medify Clinic - Maharashtra, Pune", price: 400, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 122, name: "Dr. Padma Srinivasan", specialty: "Pediatrician", rating: 4.9, experience: 17, experienceText: "17 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 580, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 123, name: "Dr. Mahesh Joshi", specialty: "Pediatrician", rating: 4.8, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Ahmedabad", clinic: "Medify Clinic - Gujarat, Ahmedabad", price: 480, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 124, name: "Dr. Kavita Bhatia", specialty: "Pediatrician", rating: 4.9, experience: 15, experienceText: "15 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Kolkata", clinic: "Medify Clinic - West Bengal, Kolkata", price: 560, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 125, name: "Dr. Rohan Desai", specialty: "Pediatrician", rating: 4.7, experience: 9, experienceText: "9 YEARS", credentials: "MBBS, MD (Pediatrics)", location: "Surat", clinic: "Medify Clinic - Gujarat, Surat", price: 430, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] }
    ],
    "Gynecology": [
        { id: 17, name: "Dr. Sunita Verma", specialty: "Gynecologist", rating: 4.9, experience: 18, experienceText: "18 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 700, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 18, name: "Dr. Nisha Kapoor", specialty: "Gynecologist", rating: 4.8, experience: 15, experienceText: "15 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 650, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 19, name: "Dr. Meera Chopra", specialty: "Gynecologist", rating: 4.7, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MS", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 600, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English", "Hindi"] },
        { id: 20, name: "Dr. Pooja Sethi", specialty: "Gynecologist", rating: 4.6, experience: 10, experienceText: "10 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 550, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 126, name: "Dr. Lakshmi Venkatesh", specialty: "Gynecologist", rating: 4.9, experience: 19, experienceText: "19 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Hyderabad", clinic: "Medify Clinic - Telangana, Hyderabad", price: 720, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 127, name: "Dr. Rekha Malhotra", specialty: "Gynecologist", rating: 4.8, experience: 14, experienceText: "14 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Pune", clinic: "Medify Clinic - Maharashtra, Pune", price: 630, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 128, name: "Dr. Priyanka Reddy", specialty: "Gynecologist", rating: 4.9, experience: 16, experienceText: "16 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 680, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 129, name: "Dr. Anitha Menon", specialty: "Gynecologist", rating: 4.7, experience: 11, experienceText: "11 YEARS", credentials: "MBBS, MS (Obstetrics & Gynecology)", location: "Thrissur", clinic: "Medify Clinic - Kerala, Thrissur", price: 580, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English"] }
    ],
    "Orthopedics": [
        { id: 21, name: "Dr. Manoj Tiwari", specialty: "Orthopedist", rating: 4.9, experience: 19, experienceText: "19 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Delhi", clinic: "Medify Clinic - Delhi, New Delhi", price: 750, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 22, name: "Dr. Supriya Bansal", specialty: "Orthopedist", rating: 4.8, experience: 16, experienceText: "16 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Mumbai", clinic: "Medify Clinic - Maharashtra, Mumbai", price: 700, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 23, name: "Dr. Varun Khanna", specialty: "Orthopedist", rating: 4.7, experience: 13, experienceText: "13 YEARS", credentials: "MBBS, MS", location: "Bangalore", clinic: "Medify Clinic - Karnataka, Bangalore", price: 650, best: false, onlineAvailable: true, hospitalVisit: false, languages: ["English", "Hindi"] },
        { id: 24, name: "Dr. Tanvi Mathur", specialty: "Orthopedist", rating: 4.6, experience: 11, experienceText: "11 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Pune", clinic: "Medify Clinic - Maharashtra, Pune", price: 600, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 130, name: "Dr. Karthik Subramanian", specialty: "Orthopedist", rating: 4.9, experience: 21, experienceText: "21 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Chennai", clinic: "Medify Clinic - Tamil Nadu, Chennai", price: 780, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English"] },
        { id: 131, name: "Dr. Aditya Sood", specialty: "Orthopedist", rating: 4.8, experience: 14, experienceText: "14 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Chandigarh", clinic: "Medify Clinic - Punjab, Chandigarh", price: 680, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 132, name: "Dr. Neeraj Agarwal", specialty: "Orthopedist", rating: 4.9, experience: 18, experienceText: "18 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Jaipur", clinic: "Medify Clinic - Rajasthan, Jaipur", price: 740, best: true, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] },
        { id: 133, name: "Dr. Swati Kulkarni", specialty: "Orthopedist", rating: 4.7, experience: 12, experienceText: "12 YEARS", credentials: "MBBS, MS (Orthopedics)", location: "Nagpur", clinic: "Medify Clinic - Maharashtra, Nagpur", price: 620, best: false, onlineAvailable: true, hospitalVisit: true, languages: ["English", "Hindi"] }
    ]
};

let selectedDoctor = null;
window.currentDepartment = null;

// Specialty to Department mapping
const specialtyToDepartment = {
    "General Medicine": "General Medicine",
    "General Physician": "General Medicine",
    "Dermatology": "Dermatology",
    "Gynecology": "Gynecology",
    "Obstetrics & Gynecology": "Gynecology",
    "Orthopedics": "Orthopedics",
    "Orthopaedics": "Orthopedics",
    "ENT": "General Medicine", // Map to closest available
    "Neurology": "General Medicine",
    "Cardiology": "Cardiology",
    "Urology": "General Medicine",
    "Gastroenterology": "General Medicine",
    "Gastroenterology/GI Surgery": "General Medicine",
    "Psychiatry": "General Medicine",
    "Pediatrics": "Pediatrics",
    "Paediatrics": "Pediatrics",
    "Pulmonology": "General Medicine",
    "Pulmonology/Respiratory Medicine": "General Medicine",
    "Endocrinology": "General Medicine",
    "Nephrology": "General Medicine",
    "Neurosurgery": "General Medicine",
    "Rheumatology": "General Medicine",
    "Ophthalmology": "General Medicine",
    "Surgical Gastroenterology": "General Medicine",
    "Infectious Disease": "General Medicine",
    "General Surgery": "General Medicine",
    "General & Laparoscopic Surgery": "General Medicine",
    "Psychology": "General Medicine",
    "Oncology": "General Medicine",
    "Medical Oncology": "General Medicine",
    "Diabetology": "General Medicine",
    "Dentist": "General Medicine"
};

// Specialty card click handler
const specialtyCards = document.querySelectorAll('.specialty-card');
const consultationSection = document.getElementById('consultation');
const bookingSection = document.getElementById('booking-form');
// These elements might not exist on all pages, so we'll query them when needed
// const doctorsListContainer = document.getElementById('doctors-list-container');
// const doctorsPageTitle = document.getElementById('doctors-page-title');
// const doctorsCount = document.getElementById('doctors-count');
// const breadcrumbSpecialty = document.getElementById('breadcrumb-specialty');

if (specialtyCards.length > 0 && consultationSection && bookingSection) {
    specialtyCards.forEach(card => {
        card.addEventListener('click', function () {
            const specialty = this.getAttribute('data-specialty');
            const specialtyName = this.querySelector('.specialty-name').textContent;
            window.currentDepartment = specialtyToDepartment[specialty] || "General Medicine";

            // Hide specialties section and show booking form
            consultationSection.style.display = 'none';
            bookingSection.style.display = 'block';

            // Update page title and breadcrumb
            const doctorsPageTitle = document.getElementById('doctors-page-title');
            const breadcrumbSpecialty = document.getElementById('breadcrumb-specialty');
            if (doctorsPageTitle) doctorsPageTitle.textContent = `Consult ${specialtyName} Online`;
            if (breadcrumbSpecialty) breadcrumbSpecialty.textContent = specialtyName;

            // Scroll to booking section
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Load doctors for selected department
            if (typeof window.displayDoctorsListing === 'function') {
                window.displayDoctorsListing(window.currentDepartment);
            }
        });
    });
}


// Display doctors listing - Make it globally accessible
window.displayDoctorsListing = function (department) {
    if (!window.doctorsDatabase) {
        return;
    }

    const doctors = window.doctorsDatabase[department] || [];

    let filteredDoctors = doctors;
    if (window.applyFilters) {
        filteredDoctors = window.applyFilters(doctors);
    }

    // Get DOM elements - support both index.html and doctors.html
    const doctorsCountEl = document.getElementById('doctors-count');
    const doctorsListContainerEl = document.getElementById('doctors-list-container');

    if (!doctorsListContainerEl) {
        return;
    }

    // FORCE VISIBILITY
    doctorsListContainerEl.style.display = 'flex';
    doctorsListContainerEl.style.flexDirection = 'column';
    doctorsListContainerEl.style.visibility = 'visible';
    doctorsListContainerEl.style.opacity = '1';

    // Update count
    if (doctorsCountEl) {
        doctorsCountEl.textContent = `(${filteredDoctors.length} doctors)`;
    }

    if (filteredDoctors.length === 0) {
        doctorsListContainerEl.innerHTML = '<div class="no-doctors"><p>No doctors found matching your filters</p></div>';
    } else {
        doctorsListContainerEl.innerHTML = filteredDoctors.map(doctor => window.createDoctorCard(doctor, department)).join('');

        // Force all doctor cards to be visible
        const cards = doctorsListContainerEl.querySelectorAll('.doctor-card');
        cards.forEach(card => {
            card.style.display = 'flex';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });

        // Attach event listeners to booking buttons
        attachBookingButtonListeners();
    }
};

// Attach event listeners to booking buttons
function attachBookingButtonListeners() {
    console.log('Attaching booking button listeners...');

    // Online Consult buttons
    const onlineButtons = document.querySelectorAll('.btn-online-consult');
    console.log('Found online consult buttons:', onlineButtons.length);

    onlineButtons.forEach((button, index) => {
        // Remove any existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Online Consult button clicked!', index);
            const doctorId = parseInt(this.getAttribute('data-doctor-id'));
            const department = this.getAttribute('data-department');
            console.log('Calling selectDoctor with:', { doctorId, department });

            if (typeof window.selectDoctor === 'function') {
                window.selectDoctor(doctorId, department, 'online');
            } else {
                console.error('selectDoctor function not found!');
                alert('Booking function not available. Please refresh the page.');
            }
        }, true); // Use capture phase
    });

    // Hospital Visit buttons
    const hospitalButtons = document.querySelectorAll('.btn-hospital-visit');
    console.log('Found hospital visit buttons:', hospitalButtons.length);

    hospitalButtons.forEach((button, index) => {
        // Remove any existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hospital Visit button clicked!', index);
            const doctorId = parseInt(this.getAttribute('data-doctor-id'));
            const department = this.getAttribute('data-department');

            if (typeof window.selectDoctor === 'function') {
                window.selectDoctor(doctorId, department, 'offline');
            } else {
                console.error('selectDoctor function not found!');
                alert('Booking function not available. Please refresh the page.');
            }
        }, true); // Use capture phase
    });
}

// Make function globally accessible
window.attachBookingButtonListeners = attachBookingButtonListeners;

// Helper function to create doctor card HTML - Make globally accessible
window.createDoctorCard = function (doctor, department) {
    return `
        <div class="doctor-card" style="display: flex !important; visibility: visible !important; opacity: 1 !important; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; position: relative;">
            <div class="doctor-avatar" style="width: 100px; height: 100px; border-radius: 8px; background: #e0f2f1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 20px; overflow: hidden;">
                <i class="fas fa-user-md" style="font-size: 3rem; color: #0097a7;"></i>
            </div>
            
            <div class="doctor-details" style="flex: 1; display: flex; flex-direction: column;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 6px;">
                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600; color: #333;">${doctor.name}</h3>
                        <i class="fas fa-info-circle" style="margin-left: 8px; color: #999; font-size: 1rem; cursor: pointer;"></i>
                    </div>
                    <div style="color: #333; font-size: 0.95rem; margin-bottom: 4px; font-weight: 500;">${doctor.specialty}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 4px;">${doctor.experienceText || doctor.experience + ' YEARS'} • ${doctor.credentials}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 4px;">${doctor.location}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 12px;">${doctor.clinic}</div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px;">
                    <div style="flex: 1;">
                        <div style="font-size: 1.4rem; font-weight: 700; color: #333; margin-bottom: 12px;">₹${doctor.price}</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 100;">
                            ${doctor.onlineAvailable ? `
                                <button class="btn-online-consult" data-doctor-id="${doctor.id}" data-department="${department}" data-type="online" onclick="event.preventDefault(); event.stopPropagation(); console.log('Button clicked!'); if(window.selectDoctor) { window.selectDoctor(${doctor.id}, '${department}', 'online'); } else { alert('Function not loaded. Please refresh.'); } return false;" style="padding: 10px 24px; background: transparent; color: #0097a7; border: 2px solid #0097a7; border-radius: 6px; cursor: pointer !important; font-weight: 600; font-size: 0.95rem; transition: all 0.3s; white-space: nowrap; position: relative; z-index: 100 !important; pointer-events: auto !important; user-select: none; -webkit-tap-highlight-color: transparent;">
                                    <i class="fas fa-video" style="margin-right: 5px; pointer-events: none;"></i> Online Consult
                                </button>
                            ` : ''}
                            ${doctor.hospitalVisit ? `
                                <button class="btn-hospital-visit" data-doctor-id="${doctor.id}" data-department="${department}" data-type="offline" onclick="event.preventDefault(); event.stopPropagation(); console.log('Button clicked!'); if(window.selectDoctor) { window.selectDoctor(${doctor.id}, '${department}', 'offline'); } else { alert('Function not loaded. Please refresh.'); } return false;" style="padding: 10px 24px; background: #0097a7; color: white; border: 2px solid #0097a7; border-radius: 6px; cursor: pointer !important; font-weight: 600; font-size: 0.95rem; transition: all 0.3s; white-space: nowrap; position: relative; z-index: 100 !important; pointer-events: auto !important; user-select: none; -webkit-tap-highlight-color: transparent;">
                                    <i class="fas fa-hospital" style="margin-right: 5px; pointer-events: none;"></i> Hospital Visit
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Apply filters to doctors - Make it globally accessible
window.applyFilters = function (doctors) {
    let filtered = [...doctors];

    // Mode of consult filter
    const hospitalFilter = document.getElementById('filter-hospital');
    const onlineFilter = document.getElementById('filter-online');

    if (hospitalFilter && onlineFilter) {
        if (!hospitalFilter.checked && !onlineFilter.checked) {
            return [];
        }
        if (!hospitalFilter.checked) {
            filtered = filtered.filter(d => d.onlineAvailable);
        }
        if (!onlineFilter.checked) {
            filtered = filtered.filter(d => d.hospitalVisit);
        }
    }

    // Experience filter
    const experienceFilters = document.querySelectorAll('.filter-experience:checked');
    if (experienceFilters.length > 0) {
        const ranges = Array.from(experienceFilters).map(f => f.value);
        filtered = filtered.filter(doctor => {
            return ranges.some(range => {
                if (range === '0-5') return doctor.experience >= 0 && doctor.experience <= 5;
                if (range === '6-10') return doctor.experience >= 6 && doctor.experience <= 10;
                if (range === '11-16') return doctor.experience >= 11 && doctor.experience <= 16;
                return true;
            });
        });
    }

    // Fees filter
    const feesFilters = document.querySelectorAll('.filter-fees:checked');
    if (feesFilters.length > 0) {
        const ranges = Array.from(feesFilters).map(f => f.value);
        filtered = filtered.filter(doctor => {
            return ranges.some(range => {
                if (range === '100-500') return doctor.price >= 100 && doctor.price <= 500;
                if (range === '500-1000') return doctor.price > 500 && doctor.price <= 1000;
                if (range === '1000+') return doctor.price > 1000;
                return true;
            });
        });
    }

    // Language filter
    const languageFilters = document.querySelectorAll('.filter-language:checked');
    if (languageFilters.length > 0) {
        const languages = Array.from(languageFilters).map(f => f.value);
        filtered = filtered.filter(doctor => {
            return languages.some(lang => doctor.languages.includes(lang));
        });
    }

    // Sort
    const sortValue = document.getElementById('sort-doctors')?.value || 'relevance';
    if (sortValue === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortValue === 'experience') {
        filtered.sort((a, b) => b.experience - a.experience);
    } else if (sortValue === 'fees-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'fees-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        // Relevance: best first, then by rating
        filtered.sort((a, b) => {
            if (a.best && !b.best) return -1;
            if (!a.best && b.best) return 1;
            return b.rating - a.rating;
        });
    }

    return filtered;
};

// Select doctor function
window.selectDoctor = function (doctorId, department, consultationType = 'online') {
    console.log('selectDoctor called:', { doctorId, department, consultationType });

    if (!window.doctorsDatabase || !window.doctorsDatabase[department]) {
        console.error('doctorsDatabase not found for department:', department);
        alert('Doctor database not loaded. Please refresh the page.');
        return;
    }

    selectedDoctor = window.doctorsDatabase[department].find(d => d.id == doctorId);
    console.log('Found doctor:', selectedDoctor);

    if (selectedDoctor) {
        showBookingModal(selectedDoctor, consultationType);
    } else {
        console.error('Doctor not found with id:', doctorId);
        alert('Doctor not found. Please try again.');
    }
};

// Show booking modal
function showBookingModal(doctor, consultationType) {
    console.log('showBookingModal called:', { doctor, consultationType });

    const modal = document.getElementById('booking-modal');
    const bookingBody = document.getElementById('booking-body');
    const bookingTitle = document.getElementById('booking-title');

    console.log('Modal elements:', { modal: !!modal, bookingBody: !!bookingBody, bookingTitle: !!bookingTitle });

    if (!modal || !bookingBody) {
        // Fallback if modal doesn't exist
        const typeText = consultationType === 'online' ? 'Online Consultation' : 'Hospital Visit';
        alert(`Doctor selected: ${doctor.name}\nConsultation Type: ${typeText}\nFee: ₹${doctor.price}\n\nModal not found on this page. Please navigate to doctors page.`);
        return;
    }

    bookingTitle.textContent = 'Schedule Appointment';

    // Generate dates for the next 7 days
    const dates = generateDateOptions();
    // Generate time slots
    const timeSlots = generateTimeSlots();

    bookingBody.innerHTML = `
        <div class="schedule-appointment-container">
            <!-- Doctor Info Section -->
            <div class="doctor-profile-section">
                <div class="doctor-avatar-large">
                    <i class="fas fa-user-md" style="font-size: 2.5rem; color: #0097a7;"></i>
                </div>
                <div class="doctor-profile-info">
                    <h3 class="doctor-name-large">${doctor.name}</h3>
                    <p class="doctor-experience">${doctor.experienceText || doctor.experience + ' YEARS'} • ${doctor.specialty}</p>
                    <a href="#" class="view-profile-link">View Profile</a>
                </div>
            </div>
            
            <!-- Date Selection Section -->
            <div class="date-selection-section">
                <div class="date-scroll-container">
                    <button class="date-scroll-btn date-scroll-left" onclick="scrollDates('left')">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="date-cards-wrapper" id="date-cards-wrapper">
                        ${dates.map((date, index) => `
                            <div class="date-card ${index === 0 ? 'selected' : ''}" data-date="${date.value}" onclick="selectDate('${date.value}', this)">
                                <div class="date-day">${date.day}</div>
                                <div class="date-number">${date.number}</div>
                                <div class="date-month">${date.month}</div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="date-scroll-btn date-scroll-right" onclick="scrollDates('right')">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Time Slot Selection Section -->
            <div class="time-slot-section" id="time-slot-section">
                ${timeSlots.map(slotGroup => `
                    <div class="time-slot-group">
                        <div class="time-slot-header">
                            <i class="fas ${slotGroup.icon}"></i>
                            <span class="time-slot-title">${slotGroup.title}</span>
                            <span class="time-slot-count">${slotGroup.slots.length} SLOTS</span>
                        </div>
                        <div class="time-slot-buttons">
                            ${slotGroup.slots.slice(0, 9).map((slot, idx) => {
        const isSelected = idx === 0 && slotGroup.title === 'Morning' && slot.value === '08:00';
        return `
                                <button type="button" class="time-slot-btn ${isSelected ? 'selected' : ''}" 
                                        data-time="${slot.value}" 
                                        onclick="selectTimeSlot('${slot.value}', this)">
                                    ${slot.label}
                                </button>
                            `;
    }).join('')}
                            ${slotGroup.slots.length > 9 ? `
                                <a href="#" class="view-more-slots" onclick="event.preventDefault(); return false;">View More Slots</a>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add footer after booking body
    const modalContent = modal.querySelector('.modal-content');
    let footer = modalContent.querySelector('.booking-footer');
    if (!footer) {
        footer = document.createElement('div');
        footer.className = 'booking-footer';
        footer.innerHTML = `
            <div class="booking-price">
                <span class="price-amount">₹${doctor.price}</span>
            </div>
            <button type="button" class="btn-continue-booking" onclick="confirmScheduleBooking('${doctor.id}', '${consultationType}')">
                Request appointment
            </button>
        `;
        modalContent.appendChild(footer);
    } else {
        footer.style.display = 'flex';
        footer.querySelector('.price-amount').textContent = `₹${doctor.price}`;
        footer.querySelector('.btn-continue-booking').textContent = 'Request appointment';
        footer.querySelector('.btn-continue-booking').setAttribute('onclick', `confirmScheduleBooking('${doctor.id}', '${consultationType}')`);
    }

    // Show modal - FORCE IT TO DISPLAY
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '2000';
    modal.style.position = 'fixed';

    // Lock background scroll so only the modal scrolls
    document.body.style.overflow = 'hidden';

    // Also ensure modal content is visible
    if (modalContent) {
        modalContent.style.display = 'block';
        modalContent.style.visibility = 'visible';
    }

    console.log('Modal displayed. Check if visible:', modal.style.display, modal.offsetParent !== null);

    // Store selected values
    window.selectedDate = dates[0].value;
    window.selectedTime = timeSlots.find(g => g.title === 'Morning')?.slots[0]?.value || '08:00';

    // Close modal when clicking outside
    const existingOnClick = window.onclick;
    window.onclick = function (event) {
        if (event.target === modal) {
            closeBookingModal();
        }
        if (existingOnClick) {
            existingOnClick(event);
        }
    };
}

// Generate date options for next 7 days
function generateDateOptions() {
    const dates = [];
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            day: days[date.getDay()],
            number: date.getDate(),
            month: months[date.getMonth()],
            value: date.toISOString().split('T')[0]
        });
    }
    return dates;
}

// Generate time slots – 20 min each, 4 morning + 4 evening
function generateTimeSlots() {
    function toSlot(hour, minute) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        return { label: time12, value: time24 };
    }
    const morningSlots = [
        toSlot(8, 0), toSlot(8, 20), toSlot(8, 40), toSlot(9, 0)
    ];
    const eveningSlots = [
        toSlot(17, 0), toSlot(17, 20), toSlot(17, 40), toSlot(18, 0)
    ];
    return [
        { title: 'Morning', icon: 'fa-sun', slots: morningSlots },
        { title: 'Evening', icon: 'fa-moon', slots: eveningSlots }
    ];
}

// Select date
function selectDate(dateValue, element) {
    // Remove selected class from all date cards
    document.querySelectorAll('.date-card').forEach(card => {
        card.classList.remove('selected');
    });
    // Add selected class to clicked card
    element.classList.add('selected');
    window.selectedDate = dateValue;
}

// Select time slot
function selectTimeSlot(timeValue, element) {
    // Remove selected class from all time slot buttons
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    // Add selected class to clicked button
    element.classList.add('selected');
    window.selectedTime = timeValue;
}

// Scroll dates
function scrollDates(direction) {
    const wrapper = document.getElementById('date-cards-wrapper');
    const scrollAmount = 200;
    if (direction === 'left') {
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Request appointment (replaces immediate booking)
function confirmScheduleBooking(doctorId, consultationType) {
    if (!window.selectedDate || !window.selectedTime) {
        alert('Please select a date and time slot.');
        return;
    }

    const department = window.currentDepartment || 'General Medicine';
    const doctor = window.doctorsDatabase[department]?.find(d => d.id == doctorId);

    if (!doctor) {
        alert('Doctor information not found.');
        return;
    }

    const selectedDate = new Date(window.selectedDate);
    const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = formatTime(window.selectedTime);

    const modalBody = document.getElementById('booking-body');
    const modalTitle = document.getElementById('booking-title');

    if (modalBody && modalTitle) {
        modalTitle.textContent = 'Request sent';

        modalBody.innerHTML = `
            <div style="text-align: center; padding: 30px 20px;">
                <div style="width: 80px; height: 80px; background: #e0f2f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas fa-paper-plane" style="font-size: 3rem; color: #0097a7;"></i>
                </div>
                <h3 style="color: #333; margin-bottom: 15px;">Request has been sent</h3>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.7; max-width: 320px; margin-left: auto; margin-right: auto;">
                    You'll be notified once the doctor accepts it and the appointment will be scheduled.
                </p>
                <p style="color: #555; font-size: 0.95rem; margin-bottom: 25px;">
                    <strong>${doctor.name}</strong><br>
                    <span style="color: #888;">${dateStr} • ${timeStr}</span>
                </p>
                <button type="button" class="btn-continue-booking" onclick="closeBookingModal()">
                    Close
                </button>
            </div>
        `;

        const footer = document.querySelector('.booking-footer');
        if (footer) footer.style.display = 'none';
    } else {
        alert("Request has been sent. You'll be notified once the doctor accepts it and the appointment will be scheduled.");
        closeBookingModal();
    }
}

// Format time from 24-hour to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Make functions globally accessible
window.selectDate = selectDate;
window.selectTimeSlot = selectTimeSlot;
window.scrollDates = scrollDates;
window.confirmScheduleBooking = confirmScheduleBooking;

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
    }
    // Restore body scroll
    document.body.style.overflow = '';
}

// Handle booking submission
function handleBookingSubmission(doctor, consultationType) {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);

    const bookingData = {
        doctor: doctor.name,
        specialty: doctor.specialty,
        consultationType: consultationType === 'online' ? 'Online Consultation' : 'Hospital Visit',
        patientName: formData.get('patient-name'),
        patientAge: formData.get('patient-age'),
        patientGender: formData.get('patient-gender'),
        patientPhone: formData.get('patient-phone'),
        consultationDate: formData.get('consultation-date'),
        consultationTime: formData.get('consultation-time'),
        symptoms: formData.get('symptoms'),
        fee: doctor.price
    };

    // Show success message
    alert(`Booking Confirmed!\n\nDoctor: ${bookingData.doctor}\nConsultation Type: ${bookingData.consultationType}\nDate: ${bookingData.consultationDate}\nTime: ${bookingData.consultationTime}\nTotal Fee: ₹${bookingData.fee}\n\nYou will receive a confirmation SMS shortly.`);

    // Close modal
    closeBookingModal();

    // Here you would typically send this data to your backend API
    console.log('Booking Data:', bookingData);
}

// Make functions globally accessible
window.closeBookingModal = closeBookingModal;

// Filter change handlers
document.addEventListener('DOMContentLoaded', function () {
    const filterInputs = document.querySelectorAll('.filter-experience, .filter-fees, .filter-language, #filter-hospital, #filter-online');
    filterInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (window.currentDepartment && typeof window.displayDoctorsListing === 'function') {
                window.displayDoctorsListing(window.currentDepartment);
            }
        });
    });

    const sortDropdown = document.getElementById('sort-doctors');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function () {
            if (window.currentDepartment && typeof window.displayDoctorsListing === 'function') {
                window.displayDoctorsListing(window.currentDepartment);
            }
        });
    }

    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function (e) {
            e.preventDefault();
            filterInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                }
            });
            if (document.getElementById('filter-hospital')) document.getElementById('filter-hospital').checked = true;
            if (document.getElementById('filter-online')) document.getElementById('filter-online').checked = true;
            if (window.currentDepartment && typeof window.displayDoctorsListing === 'function') {
                window.displayDoctorsListing(window.currentDepartment);
            }
        });
    }
});


// Form Submission
const consultationForm = document.querySelector('.consultation-form form');
if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            alert('Please select a doctor');
            return;
        }

        const datetime = document.getElementById('appointment-datetime').value;
        const symptoms = document.getElementById('symptoms-description').value;

        if (!datetime) {
            alert('Please select date and time');
            return;
        }

        alert(`Appointment booked successfully!\n\nDoctor: ${selectedDoctor.name}\nDepartment: ${currentDepartment}\nDate & Time: ${new Date(datetime).toLocaleString()}\nFee: ₹${selectedDoctor.price}`);
        consultationForm.reset();
        doctorSearchGroup.style.display = 'none';
        doctorsList.classList.remove('show');
        selectedDoctor = null;
    });
}

const loginForm = document.querySelector('.login-form');
const loginSubmitBtn = document.getElementById('login-btn');
const loginText = document.getElementById('login-text');
const profileIcon = document.getElementById('profile-icon');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate successful login
        if (loginSubmitBtn && loginText && profileIcon) {
            loginText.style.display = 'none';
            profileIcon.style.display = 'block';
            loginSubmitBtn.classList.add('profile-btn');
            loginSubmitBtn.setAttribute('href', '#profile');
            loginSubmitBtn.title = 'Profile';
        }
        modal.style.display = 'none';
        alert('Login successful!');
    });
}

// Checkout button – save cart and go to checkout page
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            try {
                sessionStorage.setItem('medify_checkout_cart', JSON.stringify(cart));
            } catch (e) {}
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty. Add items to proceed.');
        }
    });
}

// Scroll Animation (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Initialize - show first section immediately
if (document.querySelector('.hero')) {
    document.querySelector('.hero').style.opacity = '1';
    document.querySelector('.hero').style.transform = 'translateY(0)';
}

// Initialize cart count on page load
updateCartCount();

