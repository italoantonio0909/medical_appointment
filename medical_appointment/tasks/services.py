from django_celery_beat.models import (CrontabSchedule, IntervalSchedule,
                                       PeriodicTask)


def task_setup_periodic(*, tasks: list = []):

    # Clean data in Period tasks module
    IntervalSchedule.objects.all().delete()
    CrontabSchedule.objects.all().delete()
    PeriodicTask.objects.all().delete()

    # Tasks list
    if tasks:
        for periodic_task in tasks:
            cron = CrontabSchedule.objects.create(
                **periodic_task['cron']
            )

            PeriodicTask.objects.create(
                name=periodic_task['name'],
                task=periodic_task['task'].name,
                crontab=cron,
                enabled=periodic_task['enabled']
            )

    return tasks
