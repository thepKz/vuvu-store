import React from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './admin/AdminLayout';

const AdminApp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminLayout />
    </motion.div>
  );
};

export default AdminApp;