/**
 * Service μεθόδων για τις μεθόδους διαχείρισης ημερομηνιών
 */
angular.module('app.utils').service('DateService', [
    '$rootScope',
    '$http',
    '$log',
    'FileSaver',
    function($rootScope, $http, $log, FileSaver) {

        /**
         * Αναγνωριστικό Timezone Ελλάδας (Current Default Timezone)
         * @type {string}
         */
        var EUROPE_ATHENS_TIMEZONE = "Europe/Athens";

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * βάση των διακριτών τιμών των στοιχείων της ημερομηνίας και της ώρας
         * @param year Έτος
         * @param month Μήνας (ακριβής τιμή ως string ή zero-based (-1) ως int)
         * @param day Ημέρα
         * @param hours Ώρα
         * @param minutes Λεπτά της ώρας
         * @returns {*}
         */
        function getFormattedMomentWithTzFromDateTimeFields(year, month, day, hours, minutes) {

            var strYear = year.toString();
            var strMonth = (typeof month === 'string') ? month : (month + 1).toString();
            var strDay = day.toString();

            strMonth = ('00' + strMonth).substring(strMonth.length);
            strDay = ('00' + strDay).substring(strDay.length);

            var fullDate = strYear.concat('-').concat(strMonth).concat('-').concat(strDay);

            return moment.tz(fullDate, EUROPE_ATHENS_TIMEZONE).hours(hours).minutes(minutes).seconds(0).format();
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * βάση της ημερομηνίας και των στοιχείων της ώρας
         * @param date Ημερομηνία
         * @param hours Ώρα
         * @param minutes Λεπτά της ώρας
         * @returns {*}
         */
        function getFormattedMomentWithTzFromDateTime(date, hours, minutes) {
            return getFormattedMomentWithTzFromDateTimeFields(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * βάση συγκεκριμένης τιμής moment ώρα (00:00)
         * @param momentArg Χρονική στιγμή
         * @returns {*}
         */
        function getFormattedMomentWithTzFromMomentDate(momentArg) {
            return getFormattedMomentWithTzFromMomentTime(momentArg, 0, 0);
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * βάση συγκεκριμένης τιμής moment και των στοιχείων της ώρας
         * @param momentArg Χρονική στιγμή
         * @param hours Ώρα
         * @param minutes Λεπτά της ώρας
         * @returns {*}
         */
        function getFormattedMomentWithTzFromMomentTime(momentArg, hours, minutes) {
            return getFormattedMomentWithTzFromDateTimeFields(
                moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).format('YYYY'),
                moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).format('M'),
                moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).format('D'),
                hours, minutes);
        };

        /**
         * Τώρα
         * @returns {*} Moment
         */
        function nowMoment() {
            return moment().tz(EUROPE_ATHENS_TIMEZONE);
        };

        /**
         * Σήμερα
         * @returns {*}
         */
        function today() {
            return moment().tz(EUROPE_ATHENS_TIMEZONE).seconds(0).format();
        };

        /**
         * Αύριο
         * @returns {*}
         */
        function tomorrow() {
            return moment().add(1, 'd').tz(EUROPE_ATHENS_TIMEZONE).seconds(0).format();
        };

        /**
         * Μεθαύριο
         * @returns {*}
         */
        function afterTomorrow() {
            return moment().add(2, 'd').tz(EUROPE_ATHENS_TIMEZONE).seconds(0).format();
        };
        
        /**
         * Σήμερα (μόνο ημερομηνία)
         * @returns {*}
         */
        function todayDate() {
            return moment().tz(EUROPE_ATHENS_TIMEZONE).hours(0).minutes(0).seconds(0).format();
        };

        /**
         * Μορφοποίηση στοιχείων ώρας σε string με 2 χαρακτήρες
         * @param n
         * @returns {string}
         */
        function formatTimeNumber(n) {
            if (n === null || n === undefined) {
                n = 0;
            }
            return n > 9 ? '' + n : '0' + n;
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * βάση συγκεκριμένης τιμής moment που περιλαμβάνει και στοιχεία ώρας
         * @param momentArg Χρονική στιγμή
         * @returns {*}
         */
        function getFormattedMomentWithTzFromTimestamp(momentArg) {
            return moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).seconds(0).format();
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * Επιστρέφονται μόνο τα στοιχεία της ώρας [hh:mm]
         * @param momentArg
         * @returns {string}
         */
        function getFormattedTimeWithTzFromTimestamp(momentArg) {

            var hours = moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).get('hours');
            var minutes = moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).get('minutes');

            return formatTimeNumber(hours).concat(':').concat(formatTimeNumber(minutes));
        };

        /**
         * Ανάκτηση formatted timezone για συγκεκριμένη χρονική στιγμή
         * Επιστρέφεται η ημερομηνία στη μορφή [DD-MM-YYYY HH:mm]
         * @param momentArg
         * @returns {*}
         */
        function getFormattedMomentWithTzFromTimestampFull(momentArg) {
            return moment.tz(momentArg, EUROPE_ATHENS_TIMEZONE).seconds(0).format('DD-MM-YYYY HH:mm');
        };

        //Exposed functions
        return {
            getFormattedMomentWithTzFromDateTimeFields: getFormattedMomentWithTzFromDateTimeFields,
            getFormattedMomentWithTzFromDateTime: getFormattedMomentWithTzFromDateTime,
            getFormattedMomentWithTzFromMomentDate: getFormattedMomentWithTzFromMomentDate,
            getFormattedMomentWithTzFromMomentTime: getFormattedMomentWithTzFromMomentTime,
            nowMoment: nowMoment,
            today: today,
            tomorrow: tomorrow,
            afterTomorrow: afterTomorrow,
            todayDate: todayDate,
            getFormattedMomentWithTzFromTimestamp: getFormattedMomentWithTzFromTimestamp,
            getFormattedTimeWithTzFromTimestamp: getFormattedTimeWithTzFromTimestamp,
            getFormattedMomentWithTzFromTimestampFull: getFormattedMomentWithTzFromTimestampFull
        };
    }
]);