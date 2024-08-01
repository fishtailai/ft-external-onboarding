// API key for authorization
const API_KEY = 'change-this';

// Base URLs for the backend and frontend
const BACKEND_BASE_URL = 'https://api.fishtail.app';
const FRONTEND_BASE_URL = 'https://fishtail.app';

document.getElementById('create-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const createButton = document.getElementById('create-button');
  createButton.disabled = true;
  createButton.textContent = 'Creating...';

  const userEmail = document.getElementById('user-email').value;
  const userPassword = document.getElementById('user-password').value;
  const userName = document.getElementById('user-name').value;
  const companyName = document.getElementById('company-name').value;
  const addressLine1 = document.getElementById('address-line1').value;
  const addressCity = document.getElementById('address-city').value;
  const addressRegion = document.getElementById('address-region').value;
  const addressPostalCode = document.getElementById('address-postal-code').value;
  const addressCountryCode = document.getElementById('address-country-code').value;

  try {
    const { data, status } = await createBorrowerAndManager({
      email: userEmail,
      password: userPassword,
      name: userName
    }, {
      name: companyName
    }, {
      city: addressCity,
      country_code: addressCountryCode,
      line_1: addressLine1,
      postal_code: addressPostalCode,
      region: addressRegion
    });

    if (status === 201) {
      alert('Borrower and Manager created successfully');
      document.getElementById('step-1').classList.add('hidden');
      document.getElementById('step-2').classList.remove('hidden');
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    createButton.disabled = false;
    createButton.textContent = 'Create';
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginButton = document.getElementById('login-button');
  loginButton.disabled = true;
  loginButton.textContent = 'Logging in...';

  const loginEmail = document.getElementById('login-email').value;
  const loginPassword = document.getElementById('login-password').value;

  try {
    const { data, status } = await loginBorrower({
      email: loginEmail,
      password: loginPassword
    });

    if (status === 200) {
      alert('Login successful');
      document.getElementById('step-2').classList.add('hidden');
      document.getElementById('step-3').classList.remove('hidden');
      document.getElementById('onboarding-iframe').src = `${FRONTEND_BASE_URL}/external/onboarding?token=${data.access_token}`;
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Login';
  }
});

// Function to create borrower and manager, this kick-starts the onboarding process by setting up everything needed.
// Keep in mind that the user entered here will be the manager of the borrower, and its credentials will be used to log in.
async function createBorrowerAndManager(user, company, address) {
  const response = await fetch(`${BACKEND_BASE_URL}/v1/external_borrowers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ user, company, address })
  });

  return { data: await response.json(), status: response.status };
}

// Function to log in the borrower, this will return an access token that can be used to access the fishtail external onboarding page.
async function loginBorrower(user) {
  const response = await fetch(`${BACKEND_BASE_URL}/v1/external_borrowers/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ user })
  });

  return { data: await response.json(), status: response.status };
}
