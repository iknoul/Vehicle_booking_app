export const formatDate = (date: any) => {
    try {
      if (!date) return null; // Return null if no date is selected

    // Convert moment object to JavaScript Date object
    const jsDate = date.toDate(); 
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(jsDate.getDate()).padStart(2, '0');

    // Format to YYYY-MM-DD
    return `${year}-${month}-${day}`;
    } catch (error) {
      throw new Error('error in data converting')
    }
};