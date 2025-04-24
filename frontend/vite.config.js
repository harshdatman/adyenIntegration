// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/create-payment': 'http://localhost:3000',  // Proxy for payment initiation
//       '/payment-details': 'http://localhost:3000',  // Proxy for payment details webhook
//     },
//   },
// });



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/create-payment': 'http://localhost:3000/dev',
//       '/payment-details': 'http://localhost:3000/dev',
//       '/webhook': 'http://localhost:3000/dev',
//     },
//   },
// });



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/create-payment': 'http://localhost:3000/dev',
      '/submit-payment': 'http://localhost:3000/dev',
      '/payment-details': 'http://localhost:3000/dev',
      '/webhook': 'http://localhost:3000/dev',
      '/create-session': 'http://localhost:3000/dev'
    },
  },
});
