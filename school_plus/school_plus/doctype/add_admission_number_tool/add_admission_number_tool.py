# -*- coding: utf-8 -*-
# Copyright (c) 2019, efeone and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class AddAdmissionNumberTool(Document):
	def update_student(self):
		if self.student_admission_number_list:
			for student_detail in self.student_admission_number_list:
				frappe.db.set_value("Student", student_detail.student, "admission_number", student_detail.admission_number)

@frappe.whitelist()
def get_student_list(program, academic_year):
	return frappe.db.sql("""
		select
			name, student, student_name
		from
			`tabProgram Enrollment`
		where
			docstatus=1 and program='{0}' and academic_year='{1}'
	""".format(program, academic_year), as_dict=True)
