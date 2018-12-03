# -*- coding: utf-8 -*-
# Copyright (c) 2018, efeone and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe, json
from frappe.model.document import Document

class StudentPrintTemplate(Document):
	pass

@frappe.whitelist()
def render_student_doc_template(template_name, doc):
	print ("\n\n\n\n##########\n\n\n")
	if isinstance(doc, str):
		doc = json.loads(doc)
	else:
		doc = doc.as_dict()
	print_template = frappe.get_doc("Student Print Template", template_name)
	if print_template.template:
		return frappe.render_template(print_template.template, doc)
