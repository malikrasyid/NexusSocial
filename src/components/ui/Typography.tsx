import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Heading = ({ children, style }: TypographyProps) => (
  <Text style={[styles.h1, style]}>{children}</Text>
);

export const SubText = ({ children, style }: TypographyProps) => (
  <Text style={[styles.sub, style]}>{children}</Text>
);

export const Label = ({ children, style }: TypographyProps) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

export const Body = ({ children, style, numberOfLines }: TypographyProps) => (
  <Text style={[styles.body, style]} numberOfLines={numberOfLines}>{children}</Text>
);

export const Caption = ({ children, style }: TypographyProps) => (
  <Text style={[styles.caption, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  body: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#9ca3af',
  },
});