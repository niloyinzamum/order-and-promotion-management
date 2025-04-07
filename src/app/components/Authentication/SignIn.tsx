// import React, { useState } from 'react';

// const SignIn: React.FC = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Add authentication logic here
//         if (email === 'user@example.com' && password === 'password') {
//             // Redirect to dashboard or set user state
//         } else {
//             setError('Invalid email or password');
//         }
//     };

//     return (
//         <div className="sign-in">
//             <h2>Sign In</h2>
//             {error && <p className="error">{error}</p>}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Sign In</button>
//             </form>
//         </div>
//     );
// };

// export default SignIn;