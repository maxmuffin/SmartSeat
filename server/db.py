import sqlite3


def create_connection():
    """Create an SQLite3 DB on disk"""
    conn = sqlite3.connect("DB/SmartSeat.db")
    print(sqlite3.version)
    conn.execute(
        "CREATE TABLE USERS IF NOT_EXIST (" +
        "   USERNAME\tTEXT\tPRIMARY KEY\tNOT NULL," +
        "   PASSWORD\t TEXT\tNOT NULL," +
        "   NAME\tTEXT\tNOT NULL," +
        "   SURNAME\tTEXT\tNOT NULL," +
        "   MAIL\tTEXT\tNOT NULL," +
        "   WEIGHT\tREAL," +
        "   HEIGHT\tREAL," +
        "   SEX\tCHAR(1)" +
        ")"
    )
    conn.close()


if __name__ == '__main__':
    create_connection()

