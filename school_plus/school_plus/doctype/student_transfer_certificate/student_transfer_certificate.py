# -*- coding: utf-8 -*-
# Copyright (c) 2018, efeone and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class StudentTransferCertificate(Document):
	def validate(self):
		# TODO: Validate all dates in TC
		validate_student(self)

	def get_courses(self):
		return frappe.db.sql('''select course, course_name from `tabProgram Course` where parent = %s and required = 1''', (self.leaving_program), as_dict=1)

def validate_student(doc):
	query = """
		select
			name, student
		from
			`tabStudent Transfer Certificate`
		where
			name != %(name)s and student = %(student)s and docstatus=1
		"""

	if not doc.name:
		# hack! if name is null, it could cause problems with !=
		doc.name = "New "+doc.doctype

	overlap_doc = frappe.db.sql(query.format(doc.doctype),{
			"student": doc.get("student"),
			"name": doc.name
		}, as_dict = 1)

	if overlap_doc:
		throw_overlap_error(doc, overlap_doc[0].student, overlap_doc[0].name)

def throw_overlap_error(doc, student, tc):
	msg = _("A {0} exists for student {1} (").format(doc.doctype, student) \
		+ """ <b><a href="#Form/{0}/{1}">{1}</a></b>)""".format(doc.doctype, tc)
	frappe.throw(msg)
