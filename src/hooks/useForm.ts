import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface FormField {
  value: string;
  error: string;
  touched: boolean;
  rules: ValidationRules;
}

type FormFields<T> = {
  [K in keyof T]: FormField;
};

export function useForm<T extends { [key: string]: any }>(initialValues: T, validationRules: { [K in keyof T]: ValidationRules }) {
  // Khởi tạo state cho form fields
  const initialFormFields = Object.keys(initialValues).reduce((acc, key) => {
    acc[key as keyof T] = {
      value: initialValues[key],
      error: '',
      touched: false,
      rules: validationRules[key as keyof T]
    };
    return acc;
  }, {} as FormFields<T>);

  const [formFields, setFormFields] = useState<FormFields<T>>(initialFormFields);

  // Validate một field
  const validateField = useCallback((name: keyof T, value: string, rules: ValidationRules): string => {
    if (rules.required && !value) {
      return 'Trường này là bắt buộc';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return `Tối thiểu ${rules.minLength} ký tự`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Tối đa ${rules.maxLength} ký tự`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Giá trị không hợp lệ';
    }
    if (rules.custom && !rules.custom(value)) {
      return 'Giá trị không hợp lệ';
    }
    return '';
  }, []);

  // Handle change
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof T],
        value,
        touched: true,
        error: validateField(name as keyof T, value, prev[name as keyof T].rules)
      }
    }));
  }, [validateField]);

  // Handle blur
  const handleBlur = useCallback((name: keyof T) => {
    setFormFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        error: validateField(name, prev[name].value, prev[name].rules)
      }
    }));
  }, [validateField]);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFormFields = { ...formFields };

    Object.keys(formFields).forEach(key => {
      const field = formFields[key as keyof T];
      const error = validateField(key as keyof T, field.value, field.rules);
      newFormFields[key as keyof T] = {
        ...field,
        error,
        touched: true
      };
      if (error) {
        isValid = false;
      }
    });

    setFormFields(newFormFields);
    return isValid;
  }, [formFields, validateField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormFields(initialFormFields);
  }, [initialFormFields]);

  // Get form values
  const getValues = useCallback((): T => {
    return Object.keys(formFields).reduce((acc, key) => {
      acc[key as keyof T] = formFields[key as keyof T].value;
      return acc;
    }, {} as T);
  }, [formFields]);

  return {
    formFields,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    getValues
  };
} 