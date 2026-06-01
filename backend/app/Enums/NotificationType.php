<?php

namespace App\Enums;

enum NotificationType: string
{
    case Follow = 'follow';
    case Like = 'like';
    case Comment = 'comment';
}
