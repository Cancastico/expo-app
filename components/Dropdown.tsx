import { SearchProductType } from '@/app/Produtos';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onChange: (Option: SearchProductType) => void;
  options: SearchProductType[];
  defaultValue: SearchProductType;
  classname?: string;
}

function Dropdown({ defaultValue, onChange, options }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState<SearchProductType>(defaultValue);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function handleChange(option: SearchProductType) {
    setOptionSelected(option);
    onChange(option);
    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={[styles.button, isOpen ? styles.buttonOpen : styles.buttonClosed]}
      >
        <Text style={styles.buttonText}>{optionSelected.label}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          {options.filter(option => option.value !== optionSelected.value).map((option, index) => (
            <TouchableOpacity
              onPress={() => handleChange(option)}
              style={styles.option}
              key={index}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    backgroundColor: '#3B82F6',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonClosed: {
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    top: 64,
    zIndex: 30,
  },
  option: {
    height: 64,
    borderTopColor: '#FFFFFF',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Dropdown;
