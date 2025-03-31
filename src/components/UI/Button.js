import React from 'react';
import styled, { css } from 'styled-components';

// Common button styling
const ButtonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '18px' : '16px'};
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  padding: ${props => props.size === 'small' ? '6px 12px' : props.size === 'large' ? '12px 24px' : '10px 20px'};
  white-space: nowrap;
  border: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.block && css`
    width: 100%;
    display: flex;
  `}
  
  ${props => props.rounded && css`
    border-radius: 9999px;
  `}
  
  ${props => props.iconButton && css`
    padding: ${props.size === 'small' ? '6px' : props.size === 'large' ? '12px' : '10px'};
    border-radius: ${props.rounded ? '9999px' : '4px'};
  `}
`;

// Primary button
const PrimaryButton = styled.button`
  ${ButtonBase}
  background-color: #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #0069d9;
  }
  
  &:active:not(:disabled) {
    background-color: #0062cc;
  }
`;

// Secondary button
const SecondaryButton = styled.button`
  ${ButtonBase}
  background-color: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
  
  &:active:not(:disabled) {
    background-color: #545b62;
  }
`;

// Success button
const SuccessButton = styled.button`
  ${ButtonBase}
  background-color: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #218838;
  }
  
  &:active:not(:disabled) {
    background-color: #1e7e34;
  }
`;

// Danger button
const DangerButton = styled.button`
  ${ButtonBase}
  background-color: #dc3545;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #c82333;
  }
  
  &:active:not(:disabled) {
    background-color: #bd2130;
  }
`;

// Warning button
const WarningButton = styled.button`
  ${ButtonBase}
  background-color: #ffc107;
  color: #212529;
  
  &:hover:not(:disabled) {
    background-color: #e0a800;
  }
  
  &:active:not(:disabled) {
    background-color: #d39e00;
  }
`;

// Info button
const InfoButton = styled.button`
  ${ButtonBase}
  background-color: #17a2b8;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #138496;
  }
  
  &:active:not(:disabled) {
    background-color: #117a8b;
  }
`;

// Light button
const LightButton = styled.button`
  ${ButtonBase}
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #f8f9fa;
  
  &:hover:not(:disabled) {
    background-color: #e2e6ea;
    border-color: #dae0e5;
  }
  
  &:active:not(:disabled) {
    background-color: #dae0e5;
    border-color: #d3d9df;
  }
`;

// Dark button
const DarkButton = styled.button`
  ${ButtonBase}
  background-color: #343a40;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #23272b;
  }
  
  &:active:not(:disabled) {
    background-color: #1d2124;
  }
`;

// Outline button variations
const OutlinePrimaryButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
  
  &:hover:not(:disabled) {
    background-color: #007bff;
    color: white;
  }
`;

const OutlineSecondaryButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
  
  &:hover:not(:disabled) {
    background-color: #6c757d;
    color: white;
  }
`;

const OutlineSuccessButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #28a745;
  border: 1px solid #28a745;
  
  &:hover:not(:disabled) {
    background-color: #28a745;
    color: white;
  }
`;

const OutlineDangerButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
  
  &:hover:not(:disabled) {
    background-color: #dc3545;
    color: white;
  }
`;

const OutlineWarningButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #ffc107;
  border: 1px solid #ffc107;
  
  &:hover:not(:disabled) {
    background-color: #ffc107;
    color: #212529;
  }
`;

const OutlineInfoButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #17a2b8;
  border: 1px solid #17a2b8;
  
  &:hover:not(:disabled) {
    background-color: #17a2b8;
    color: white;
  }
`;

const OutlineLightButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #f8f9fa;
  border: 1px solid #f8f9fa;
  
  &:hover:not(:disabled) {
    background-color: #f8f9fa;
    color: #212529;
  }
`;

const OutlineDarkButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #343a40;
  border: 1px solid #343a40;
  
  &:hover:not(:disabled) {
    background-color: #343a40;
    color: white;
  }
`;

// Text buttons
const TextButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: ${props => {
    if (props.primary) return '#007bff';
    if (props.secondary) return '#6c757d';
    if (props.success) return '#28a745';
    if (props.danger) return '#dc3545';
    if (props.warning) return '#ffc107';
    if (props.info) return '#17a2b8';
    if (props.light) return '#f8f9fa';
    if (props.dark) return '#343a40';
    return '#007bff';
  }};
  padding: ${props => props.size === 'small' ? '4px 8px' : props.size === 'large' ? '8px 16px' : '6px 12px'};
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

/**
 * Button Component
 *
 * @param {Object} props - Component properties
 * @param {string} props.variant - Button variant (primary, secondary, success, danger, warning, info, light, dark, outlinePrimary, etc.)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.block - Whether the button should take full width
 * @param {boolean} props.rounded - Whether the button should have fully rounded corners
 * @param {boolean} props.iconButton - Whether the button is an icon button (square aspect ratio)
 * @param {React.ReactNode} props.leftIcon - Icon to display before button text
 * @param {React.ReactNode} props.rightIcon - Icon to display after button text
 * @param {function} props.onClick - Click handler function
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  block = false,
  rounded = false,
  iconButton = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className,
  children,
  ...props
}) => {
  const getButtonComponent = () => {
    switch (variant) {
      case 'primary':
        return PrimaryButton;
      case 'secondary':
        return SecondaryButton;
      case 'success':
        return SuccessButton;
      case 'danger':
        return DangerButton;
      case 'warning':
        return WarningButton;
      case 'info':
        return InfoButton;
      case 'light':
        return LightButton;
      case 'dark':
        return DarkButton;
      case 'outlinePrimary':
        return OutlinePrimaryButton;
      case 'outlineSecondary':
        return OutlineSecondaryButton;
      case 'outlineSuccess':
        return OutlineSuccessButton;
      case 'outlineDanger':
        return OutlineDangerButton;
      case 'outlineWarning':
        return OutlineWarningButton;
      case 'outlineInfo':
        return OutlineInfoButton;
      case 'outlineLight':
        return OutlineLightButton;
      case 'outlineDark':
        return OutlineDarkButton;
      case 'text':
        return TextButton;
      default:
        return PrimaryButton;
    }
  };

  const ButtonComponent = getButtonComponent();

  return (
    <ButtonComponent
      size={size}
      disabled={disabled}
      block={block}
      rounded={rounded}
      iconButton={iconButton}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {leftIcon && <span style={{ marginRight: '8px' }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ marginLeft: '8px' }}>{rightIcon}</span>}
    </ButtonComponent>
  );
};

export default Button;