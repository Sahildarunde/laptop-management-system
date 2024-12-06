export const roleOptions = [
    {value:"Select Option", label: 'Select Option'},
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'ADMIN', label: 'Admin' },
];
export const departmentOptions = [
    {value:"Select Option", label: 'Select Option'},
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
];

export const headers = {
    headers: {
      'Authorization': `${localStorage.getItem('token')}`,
      'Role': `${localStorage.getItem('role')}`,
      'Content-Type': 'application/json',
    },
};

