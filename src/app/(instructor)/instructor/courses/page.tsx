import { getInstructorCourses } from '@/actions/instructor-courses'
import { InstructorCourseList } from '@/features/courses/components/instructor/InstructorCourseList'

export default async function InstructorCoursesPage() {
  const { data: courses, error } = await getInstructorCourses()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InstructorCourseList courses={courses || []} error={error || null} />
    </div>
  )
}
