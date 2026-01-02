from django.db import models


class CodeCounter(models.Model):
    """
    Code counter for document codification matching the PostgreSQL schema.
    """
    department = models.CharField(max_length=255)
    doc_type = models.CharField(max_length=255, db_column='docType')
    year = models.IntegerField()
    counter = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')
    
    class Meta:
        db_table = 'CodeCounter'
        unique_together = ('department', 'doc_type', 'year')
    
    def __str__(self):
        return f"{self.department}-{self.doc_type}-{self.year}: {self.counter}"
    
    @classmethod
    def generate_code(cls, department, doc_type):
        """
        Generate a unique code for a document.
        Format: DEPT-DOCTYPE-YEAR-COUNTER (e.g., HR-EXP-2025-001)
        """
        from datetime import datetime
        current_year = datetime.now().year
        
        counter_obj, created = cls.objects.get_or_create(
            department=department,
            doc_type=doc_type,
            year=current_year,
            defaults={'counter': 0}
        )
        
        counter_obj.counter += 1
        counter_obj.save()
        
        return f"{department}-{doc_type}-{current_year}-{counter_obj.counter:03d}"
