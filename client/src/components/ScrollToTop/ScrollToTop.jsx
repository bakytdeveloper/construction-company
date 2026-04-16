// import React, { useState, useEffect } from 'react';
// import './ScrollToTop.css';
//
// const ScrollToTop = () => {
//     const [isVisible, setIsVisible] = useState(false);
//
//     useEffect(() => {
//         const toggleVisibility = () => {
//             if (window.pageYOffset > 300) {
//                 setIsVisible(true);
//             } else {
//                 setIsVisible(false);
//             }
//         };
//
//         window.addEventListener('scroll', toggleVisibility);
//         return () => window.removeEventListener('scroll', toggleVisibility);
//     }, []);
//
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     };
//
//     return (
//         <>
//             {isVisible && (
//                 <button className="scroll-to-top" onClick={scrollToTop}>
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                         <path d="M12 5L12 19M12 5L18 11M12 5L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                 </button>
//             )}
//         </>
//     );
// };
//
// export default ScrollToTop;