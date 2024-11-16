import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
    const getButtonStyle = () => {
        if (variant === 'link') return 'text-purple-600 hover:text-purple-500 bg-transparent';
        return 'text-white bg-purple-600 hover:bg-purple-700 w-full py-3 px-4 rounded-lg transition-colors duration-200';
    };

    return (
        <button {...props} className={getButtonStyle()}>
            {children}
        </button>
    );
};

export default Button;