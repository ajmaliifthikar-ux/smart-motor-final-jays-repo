'use client'

import React from 'react'

export function GoogleSSOButton() {
    return (
        <button className="w-full h-[62px] transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <svg width="100%" height="62" viewBox="0 0 351 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <g filter="url(#google-filter)">
                    <rect x="3" y="3" width="345" height="54" rx="10" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M92.54 30.2613C92.54 29.4459 92.4668 28.6618 92.3309 27.9091H81.5V32.3575H87.6891C87.4225 33.795 86.6123 35.0129 85.3943 35.8284V38.7138H89.1109C91.2855 36.7118 92.54 33.7636 92.54 30.2613Z" fill="#4285F4" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M81.4999 41.4998C84.6049 41.4998 87.2081 40.47 89.1108 38.7137L85.3942 35.8282C84.3644 36.5182 83.0472 36.9259 81.4999 36.9259C78.5047 36.9259 75.9694 34.903 75.0651 32.1848H71.2231V35.1644C73.1154 38.9228 77.0044 41.4998 81.4999 41.4998Z" fill="#34A853" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M75.0652 32.1851C74.8352 31.4951 74.7045 30.7581 74.7045 30.0001C74.7045 29.2422 74.8352 28.5051 75.0652 27.8151V24.8356H71.2232C70.4443 26.3881 70 28.1444 70 30.0001C70 31.8558 70.4443 33.6122 71.2232 35.1647L75.0652 32.1851Z" fill="#FBBC05" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M81.4999 23.0739C83.1883 23.0739 84.7042 23.6541 85.896 24.7936L89.1944 21.4952C87.2029 19.6395 84.5997 18.5 81.4999 18.5C77.0044 18.5 73.1154 21.077 71.2231 24.8355L75.0651 27.815C75.9694 25.0968 78.5047 23.0739 81.4999 23.0739Z" fill="#EA4335" />
                    <text x="105" y="36" fill="black" style={{ font: 'bold 12px sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>Continue with Google</text>
                </g>
                <defs>
                    <filter id="google-filter" x="0" y="0" width="351" height="62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feGaussianBlur stdDeviation="1.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0" />
                    </filter>
                </defs>
            </svg>
        </button>
    )
}

export function AppleSSOButton() {
    return (
        <button className="w-full h-[62px] transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <svg width="100%" height="62" viewBox="0 0 351 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <g filter="url(#apple-filter)">
                    <rect x="3" y="3" width="345" height="54" rx="10" fill="black" />
                    <path d="M100.781 36.424C100.433 37.2275 100.021 37.9672 99.5441 38.6472C98.8939 39.5743 98.3615 40.216 97.9512 40.5724C97.3151 41.1573 96.6337 41.4568 95.9039 41.4739C95.3801 41.4739 94.7483 41.3248 94.0129 41.0224C93.2751 40.7214 92.597 40.5724 91.977 40.5724C91.3268 40.5724 90.6294 40.7214 89.8835 41.0224C89.1365 41.3248 88.5347 41.4824 88.0745 41.498C87.3748 41.5278 86.6772 41.2197 85.981 40.5724C85.5367 40.1848 84.9808 39.5204 84.315 38.5791C83.6006 37.5739 83.0133 36.4084 82.5531 35.0795C82.0604 33.6442 81.8133 32.2543 81.8133 30.9087C81.8133 29.3673 82.1464 28.0379 82.8135 26.9238C83.3378 26.029 84.0353 25.3231 84.9083 24.8049C85.7813 24.2867 86.7245 24.0227 87.7403 24.0058C88.2961 24.0058 89.025 24.1777 89.9308 24.5156C90.834 24.8546 91.414 25.0265 91.6682 25.0265C91.8583 25.0265 92.5026 24.8255 93.5948 24.4247C94.6276 24.0531 95.4993 23.8992 96.2134 23.9598C98.1485 24.1159 99.6023 24.8788 100.569 26.253C98.8385 27.3016 97.9824 28.7703 97.9994 30.6544C98.0151 32.122 98.5474 33.3432 99.5938 34.3129C100.068 34.7629 100.598 35.1107 101.187 35.3578C101.059 35.7283 100.924 36.0832 100.781 36.424ZM96.3426 18.9601C96.3426 20.1104 95.9224 21.1844 95.0848 22.1785C94.0739 23.3602 92.8513 24.0431 91.5254 23.9354C91.5085 23.7974 91.4987 23.6521 91.4987 23.4995C91.4987 22.3953 91.9794 21.2135 92.8331 20.2472C93.2593 19.758 93.8014 19.3512 94.4587 19.0267C95.1146 18.7071 95.735 18.5303 96.3185 18.5C96.3355 18.6538 96.3426 18.8076 96.3426 18.9601V18.9601Z" fill="white" />
                    <text x="115" y="36" fill="white" style={{ font: 'bold 12px sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>Continue with Apple</text>
                </g>
                <defs>
                    <filter id="apple-filter" x="0" y="0" width="351" height="62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feGaussianBlur stdDeviation="1.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0" />
                    </filter>
                </defs>
            </svg>
        </button>
    )
}
