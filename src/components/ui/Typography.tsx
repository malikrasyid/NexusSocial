import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  style?: any;
}

export const Heading = ({ children, style, ...props }: TypographyProps) => (
  <Text style={[styles.h1, style]} {...props}>{children}</Text>
);

export const SubText = ({ children, style, ...props }: TypographyProps) => (
  <Text style={[styles.sub, style]} {...props}>{children}</Text>
);

export const Label = ({ children, style, ...props }: TypographyProps) => (
  <Text style={[styles.label, style]} {...props}>{children}</Text>
);

export const Body = ({ children, style, ...props }: TypographyProps) => (
  <Text style={[styles.body, style]} {...props}>{children}</Text>
);

export const Caption = ({ children, style, ...props }: TypographyProps) => (
  <Text style={[styles.caption, style]} {...props}>{children}</Text>
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