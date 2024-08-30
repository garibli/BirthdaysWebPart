import * as React from 'react'
import { SPHttpClient } from '@microsoft/sp-http'
import styles from './Birthdays.module.scss'
import { IBirthdaysProps } from './IBirthdaysProps'

export interface IEmployee {
  Title: string
  isnomresi: string
  TeskilatVahidi: string
  StatVezifesi: string
  KoperatifMail: string
  birthday: string
  share: string
}

const Birthdays: React.FunctionComponent<IBirthdaysProps> = (props) => {
  const [todayEmployees, setTodayEmployees] = React.useState<IEmployee[]>([])
  const [upcomingEmployees, setUpcomingEmployees] = React.useState<IEmployee[]>(
    []
  )
  const [showToday, setShowToday] = React.useState(true)

  React.useEffect(() => {
    determineUserGroup()
  }, [])

  const determineUserGroup = async () => {
    const groupNames = ['Group A', 'Group B', 'Group C']
    const currentUserGroups = await props.spHttpClient.get(
      `${props.siteUrl}/_api/web/currentuser/?$expand=Groups`,
      SPHttpClient.configurations.v1
    )
    const currentUserGroupsData = await currentUserGroups.json()

    const group = currentUserGroupsData.Groups.find((g: { Title: string }) =>
      groupNames.includes(g.Title)
    )?.Title as 'Group A' | 'Group B' | 'Group C' | undefined

    if (group) {
      fetchEmployeeData(group)
    } else {
      console.error('User does not belong to any recognized group.')
    }
  }

  const fetchEmployeeData = async (
    group: 'Group A' | 'Group B' | 'Group C'
  ) => {
    let listUrl = ''

    switch (group) {
      case 'Group A':
        listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('employeeA')/items`
        break
      case 'Group B':
        listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('employeeB')/items`
        break
      case 'Group C':
        listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('employeeC')/items`
        break
    }

    try {
      const response = await props.spHttpClient.get(
        listUrl,
        SPHttpClient.configurations.v1
      )
      const data = await response.json()
      const employees: IEmployee[] = data.value

      const today = new Date()
      const threeMonthsLater = new Date(today)
      threeMonthsLater.setMonth(today.getMonth() + 3)

      const todayList: IEmployee[] = []
      const upcomingList: IEmployee[] = []

      employees
        .filter((emp) => emp.share === 'true')
        .forEach((emp) => {
          const empBirthday = new Date(emp.birthday)
          empBirthday.setFullYear(today.getFullYear())
          if (
            empBirthday.getDate() === today.getDate() &&
            empBirthday.getMonth() === today.getMonth()
          ) {
            todayList.push(emp)
          } else if (empBirthday > today && empBirthday <= threeMonthsLater) {
            upcomingList.push(emp)
          }
        })

      setTodayEmployees(todayList)
      setUpcomingEmployees(upcomingList)
    } catch (error) {
      console.error('Error fetching employee data', error)
    }
  }

  return (
    <div className={styles.birthdays}>
      <div className={styles.header}>
        <button onClick={() => setShowToday(true)}>Today’s Birthdays</button>
        <button onClick={() => setShowToday(false)}>Upcoming Birthdays</button>
      </div>

      <div className={styles.birthdayList}>
        {showToday ? (
          <>
            <h2>Today's Birthdays</h2>
            {todayEmployees.length > 0 ? (
              todayEmployees.map((emp) => (
                <div className={styles.birthdayCard} key={emp.isnomresi}>
                  <div className={styles.employeeInfo}>
                    <img
                      src={`https://via.placeholder.com/100`}
                      alt="employee image"
                    />
                    <p>
                      <strong>{emp.Title}</strong>
                    </p>
                    <p>{emp.StatVezifesi}</p>
                    <p>
                      {new Date(emp.birthday).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                  <button className={styles.congratsButton}>Congrats</button>
                </div>
              ))
            ) : (
              <p>No birthdays today.</p>
            )}
          </>
        ) : (
          <>
            <h2>Upcoming Birthdays</h2>
            {upcomingEmployees.length > 0 ? (
              upcomingEmployees.map((emp) => (
                <div className={styles.birthdayCard} key={emp.isnomresi}>
                  <div className={styles.employeeInfo}>
                    <img
                      src={`https://via.placeholder.com/100`}
                      alt="employee image"
                    />
                    <p>
                      <strong>{emp.Title}</strong>
                    </p>
                    <p>{emp.StatVezifesi}</p>
                    <p>
                      {new Date(emp.birthday).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming birthdays in the next three months.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Birthdays
