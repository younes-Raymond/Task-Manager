const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user.requestData.role;
  
    if (userRole === 'admin') {
      return 'admin';
    } else if (userRole === 'user') {
      return 'user';
    } else {
      return 'unknown';
    }
  };
  
  export default checkUserRole;