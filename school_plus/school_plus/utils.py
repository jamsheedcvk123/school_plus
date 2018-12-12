# -*- coding: utf-8 -*-
# Copyright (c) 2018, efeone and contributors
# For license information, please see licenspe.txt

import frappe

@frappe.whitelist()
def get_student_details(student):
	student_obj = frappe.get_doc("Student", student)
	query_start = """
		select
			pe.student_name, pe.student_category, pe.student_batch_name, pe.program, pe.academic_year,
			pe.academic_term, pe.enrollment_date
		from
			`tabProgram Enrollment` pe
		inner join (
			select
				student,
	"""
	query_end = """
				max(enrollment_date) as MaxDate
			from
				`tabProgram Enrollment`
		)pem on pe.student = pem.student and pe.enrollment_date = pem.MaxDate and pe.student = %s
	"""

	query = query_start+query_end
	last_enrollment = frappe.db.sql(query, (student), as_dict=True)

	query_end = """
				min(enrollment_date) as MinDate
			from
				`tabProgram Enrollment`
		)pem on pe.student = pem.student and pe.enrollment_date = pem.MinDate and pe.student = %s
	"""
	query = query_start+query_end
	first_enrollment = frappe.db.sql(query, (student), as_dict=True)

	return {"student": student_obj, "first_enrollment": first_enrollment, "last_enrollment": last_enrollment}
