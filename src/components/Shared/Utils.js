function dateIsBetween(date, lowerBound, upperBound) {
	return (lowerBound <= date && date <= upperBound);
}

export function gradYearToString(gradYear) {
	let presentDate = new Date();
	if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return "Freshman";
	if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return "Sophomore";
	if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return "Junior";
	if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return "Senior";
	return "Freshman";
}

export function convertDate(dateString) {
	var dateObj = new Date(dateString);
	var month = dateObj.getUTCMonth()+1;
	var day = dateObj.getUTCDay();
	var month0 = '';
	var day0 = '';
	if (month<10){
	  month0 = '0';
	}
	if (day0<10){
	  day0='0';
	}

	return(month0+ (month).toString()+"/"+day0+(day).toString());
}