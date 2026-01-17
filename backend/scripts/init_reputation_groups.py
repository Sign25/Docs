"""
Скрипт инициализации групп для Reputation Module.

Создаёт 5 групп согласно ТЗ:
1. Reputation Staff     - нет доступа к агенту @Adolf_Reputation
2. Reputation Managers  - доступ к агенту, только свой brand_id, утверждение ответов
3. Reputation Senior    - все бренды + эскалация
4. Reputation Directors - все бренды + статистика
5. Administrators       - полный доступ + настройка системы

Запуск:
    cd backend
    python scripts/init_reputation_groups.py
"""

import sys
import os

# Добавляем путь к backend для импорта
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from open_webui.models.groups import Groups, GroupForm


# Определение групп согласно ТЗ
REPUTATION_GROUPS = [
    {
        "name": "Reputation Staff",
        "description": "Базовые сотрудники. Нет доступа к агенту @Adolf_Reputation.",
        "permissions": {
            "workspace": {
                "models": False,
                "knowledge": False,
                "prompts": False,
                "tools": False,
                "models_import": False,
                "models_export": False,
                "prompts_import": False,
                "prompts_export": False,
                "tools_import": False,
                "tools_export": False,
            },
            "sharing": {
                "models": False,
                "public_models": False,
                "knowledge": False,
                "public_knowledge": False,
                "prompts": False,
                "public_prompts": False,
                "tools": False,
                "public_tools": False,
                "notes": False,
                "public_notes": False,
            },
            "chat": {
                "controls": False,
                "valves": False,
                "system_prompt": False,
                "params": False,
                "file_upload": True,
                "delete": True,
                "delete_message": True,
                "continue_response": False,
                "regenerate_response": False,
                "rate_response": True,
                "edit": True,
                "share": False,
                "export": False,
                "stt": True,
                "tts": True,
                "call": False,
                "multiple_models": False,
                "temporary": False,
                "temporary_enforced": False,
            },
            "features": {
                "api_keys": False,
                "notes": True,
                "folders": True,
                "channels": False,
                "direct_tool_servers": False,
                "web_search": False,
                "image_generation": False,
                "code_interpreter": False,
                "memories": False,
            },
            "settings": {
                "interface": True,
            },
        },
        "data": {
            "reputation": {
                "access_agent": False,
                "access_all_brands": False,
                "can_approve": False,
                "can_escalate": False,
                "can_view_stats": False,
                "can_configure": False,
            }
        },
    },
    {
        "name": "Reputation Managers",
        "description": "Менеджеры. Доступ к агенту @Adolf_Reputation, только свой brand_id, утверждение ответов.",
        "permissions": {
            "workspace": {
                "models": False,
                "knowledge": True,
                "prompts": False,
                "tools": False,
                "models_import": False,
                "models_export": False,
                "prompts_import": False,
                "prompts_export": False,
                "tools_import": False,
                "tools_export": False,
            },
            "sharing": {
                "models": False,
                "public_models": False,
                "knowledge": False,
                "public_knowledge": False,
                "prompts": False,
                "public_prompts": False,
                "tools": False,
                "public_tools": False,
                "notes": True,
                "public_notes": False,
            },
            "chat": {
                "controls": False,
                "valves": False,
                "system_prompt": False,
                "params": False,
                "file_upload": True,
                "delete": True,
                "delete_message": True,
                "continue_response": True,
                "regenerate_response": True,
                "rate_response": True,
                "edit": True,
                "share": True,
                "export": True,
                "stt": True,
                "tts": True,
                "call": False,
                "multiple_models": False,
                "temporary": False,
                "temporary_enforced": False,
            },
            "features": {
                "api_keys": False,
                "notes": True,
                "folders": True,
                "channels": True,
                "direct_tool_servers": False,
                "web_search": False,
                "image_generation": False,
                "code_interpreter": False,
                "memories": True,
            },
            "settings": {
                "interface": True,
            },
        },
        "data": {
            "reputation": {
                "access_agent": True,
                "access_all_brands": False,  # Только свой brand_id
                "can_approve": True,
                "can_escalate": False,
                "can_view_stats": False,
                "can_configure": False,
            }
        },
    },
    {
        "name": "Reputation Senior",
        "description": "Старшие менеджеры. Доступ ко всем брендам + эскалация.",
        "permissions": {
            "workspace": {
                "models": False,
                "knowledge": True,
                "prompts": False,
                "tools": False,
                "models_import": False,
                "models_export": False,
                "prompts_import": False,
                "prompts_export": False,
                "tools_import": False,
                "tools_export": False,
            },
            "sharing": {
                "models": False,
                "public_models": False,
                "knowledge": True,
                "public_knowledge": False,
                "prompts": False,
                "public_prompts": False,
                "tools": False,
                "public_tools": False,
                "notes": True,
                "public_notes": False,
            },
            "chat": {
                "controls": False,
                "valves": False,
                "system_prompt": False,
                "params": False,
                "file_upload": True,
                "delete": True,
                "delete_message": True,
                "continue_response": True,
                "regenerate_response": True,
                "rate_response": True,
                "edit": True,
                "share": True,
                "export": True,
                "stt": True,
                "tts": True,
                "call": True,
                "multiple_models": False,
                "temporary": False,
                "temporary_enforced": False,
            },
            "features": {
                "api_keys": False,
                "notes": True,
                "folders": True,
                "channels": True,
                "direct_tool_servers": False,
                "web_search": True,
                "image_generation": False,
                "code_interpreter": False,
                "memories": True,
            },
            "settings": {
                "interface": True,
            },
        },
        "data": {
            "reputation": {
                "access_agent": True,
                "access_all_brands": True,
                "can_approve": True,
                "can_escalate": True,
                "can_view_stats": False,
                "can_configure": False,
            }
        },
    },
    {
        "name": "Reputation Directors",
        "description": "Директора. Доступ ко всем брендам + статистика.",
        "permissions": {
            "workspace": {
                "models": True,
                "knowledge": True,
                "prompts": True,
                "tools": False,
                "models_import": False,
                "models_export": True,
                "prompts_import": False,
                "prompts_export": True,
                "tools_import": False,
                "tools_export": False,
            },
            "sharing": {
                "models": True,
                "public_models": False,
                "knowledge": True,
                "public_knowledge": False,
                "prompts": True,
                "public_prompts": False,
                "tools": False,
                "public_tools": False,
                "notes": True,
                "public_notes": False,
            },
            "chat": {
                "controls": True,
                "valves": False,
                "system_prompt": True,
                "params": True,
                "file_upload": True,
                "delete": True,
                "delete_message": True,
                "continue_response": True,
                "regenerate_response": True,
                "rate_response": True,
                "edit": True,
                "share": True,
                "export": True,
                "stt": True,
                "tts": True,
                "call": True,
                "multiple_models": True,
                "temporary": False,
                "temporary_enforced": False,
            },
            "features": {
                "api_keys": False,
                "notes": True,
                "folders": True,
                "channels": True,
                "direct_tool_servers": False,
                "web_search": True,
                "image_generation": False,
                "code_interpreter": False,
                "memories": True,
            },
            "settings": {
                "interface": True,
            },
        },
        "data": {
            "reputation": {
                "access_agent": True,
                "access_all_brands": True,
                "can_approve": True,
                "can_escalate": True,
                "can_view_stats": True,
                "can_configure": False,
            }
        },
    },
    {
        "name": "Reputation Administrators",
        "description": "Администраторы Reputation Module. Полный доступ + настройка системы.",
        "permissions": {
            "workspace": {
                "models": True,
                "knowledge": True,
                "prompts": True,
                "tools": True,
                "models_import": True,
                "models_export": True,
                "prompts_import": True,
                "prompts_export": True,
                "tools_import": True,
                "tools_export": True,
            },
            "sharing": {
                "models": True,
                "public_models": True,
                "knowledge": True,
                "public_knowledge": True,
                "prompts": True,
                "public_prompts": True,
                "tools": True,
                "public_tools": True,
                "notes": True,
                "public_notes": True,
            },
            "chat": {
                "controls": True,
                "valves": True,
                "system_prompt": True,
                "params": True,
                "file_upload": True,
                "delete": True,
                "delete_message": True,
                "continue_response": True,
                "regenerate_response": True,
                "rate_response": True,
                "edit": True,
                "share": True,
                "export": True,
                "stt": True,
                "tts": True,
                "call": True,
                "multiple_models": True,
                "temporary": True,
                "temporary_enforced": False,
            },
            "features": {
                "api_keys": True,
                "notes": True,
                "folders": True,
                "channels": True,
                "direct_tool_servers": True,
                "web_search": True,
                "image_generation": True,
                "code_interpreter": True,
                "memories": True,
            },
            "settings": {
                "interface": True,
            },
        },
        "data": {
            "reputation": {
                "access_agent": True,
                "access_all_brands": True,
                "can_approve": True,
                "can_escalate": True,
                "can_view_stats": True,
                "can_configure": True,
            }
        },
    },
]


def init_groups():
    """Создаёт группы если они не существуют."""
    
    # Получаем существующие группы
    existing_groups = Groups.get_all_groups()
    existing_names = {g.name for g in existing_groups}
    
    print("=" * 60)
    print("Инициализация групп Reputation Module")
    print("=" * 60)
    
    # Для создания групп нужен user_id админа
    # Используем системный ID
    SYSTEM_USER_ID = "system"
    
    created = 0
    skipped = 0
    
    for group_def in REPUTATION_GROUPS:
        name = group_def["name"]
        
        if name in existing_names:
            print(f"⏭️  Группа '{name}' уже существует - пропускаем")
            skipped += 1
            continue
        
        form = GroupForm(
            name=name,
            description=group_def["description"],
            permissions=group_def["permissions"],
            data=group_def.get("data"),
        )
        
        result = Groups.insert_new_group(user_id=SYSTEM_USER_ID, form_data=form)
        
        if result:
            print(f"✅ Создана группа: {name}")
            created += 1
        else:
            print(f"❌ Ошибка создания группы: {name}")
    
    print("=" * 60)
    print(f"Создано: {created}, Пропущено: {skipped}")
    print("=" * 60)
    
    # Выводим список всех групп
    print("\nТекущие группы в системе:")
    all_groups = Groups.get_all_groups()
    for g in all_groups:
        print(f"  - {g.name}: {g.description[:50]}...")


if __name__ == "__main__":
    init_groups()
