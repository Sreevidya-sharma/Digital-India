document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phoneNumber = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirm').value.trim();
  const gender = document.getElementById('gender').value;
  const dob = document.getElementById('dob').value;

  const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  if (!isStrong) {
    alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    return;
  }

  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }

  try {
    const res = await fetch('https://digital-india-auth-server.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phoneNumber, address, password, gender, dob })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('userDetails', JSON.stringify({ fullName, email, phoneNumber, address, gender, dob }));
      alert('✅ Registration successful! You can now log in.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || '❌ Registration failed');
    }
  } catch (err) {
    alert('Server error. Please try again.');
    console.error(err);
  }
});
