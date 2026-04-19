import { StyleSheet } from '@react-pdf/renderer';

/** Ugrađeni Helvetica u PDF — izbjegava registraciju TTF fontova u pregledniku. */
export const alatiLetterStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    color: '#111',
    lineHeight: 1.45,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  meta: {
    fontSize: 9,
    marginBottom: 12,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  label: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    fontSize: 8,
    color: '#555',
  },
});
