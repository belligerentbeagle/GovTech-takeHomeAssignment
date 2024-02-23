import pandas as pd
from datetime import datetime

# Assuming "staff-id-to-team-mapping-long.csv" contains the initial mapping of staff IDs to teams
# and "redemptions.csv" will track the redemptions

def initialize_redemptions_file(redemptions_file_path):
    # Initialize the redemptions file with columns but no data if it doesn't exist
    try:
        pd.read_csv(redemptions_file_path)
    except FileNotFoundError:
        pd.DataFrame(columns=['staff_id', 'team_name', 'created_at']).to_csv(redemptions_file_path, index=False)

def process_redemption(staff_id, staff_to_team_file_path, redemptions_file_path):
    # Load the staff to team mappings
    staff_to_team_data = pd.read_csv(staff_to_team_file_path)
    
    # Initialize or check the redemptions file
    initialize_redemptions_file(redemptions_file_path)
    redemptions_data = pd.read_csv(redemptions_file_path)
    
    # Check if the staff_id exists in the staff to team mapping
    if staff_id not in staff_to_team_data['staff_id'].values:
        print("Staff ID not found.")
        return
    
    # Find the team of the staff
    team_name = staff_to_team_data.loc[staff_to_team_data['staff_id'] == staff_id, 'team_name'].values[0]
    
    # Check if someone from the team has already redeemed a gift
    if team_name in redemptions_data['team_name'].values:
        print("A team member has already redeemed a gift.")
        return
    
    # If not, proceed with redemption
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    new_redemption = pd.DataFrame({'staff_id': [staff_id], 'team_name': [team_name], 'created_at': [current_time]})
    redemptions_data = pd.concat([redemptions_data, new_redemption], ignore_index=True)
    
    # Save the updated redemptions data back to the CSV
    redemptions_data.to_csv(redemptions_file_path, index=False)
    print(f"Gift redeemed for team {team_name} by staff {staff_id} at {current_time}.")

# File paths
staff_to_team_file_path = 'GovWallet/data/staff-id-to-team-mapping.csv'
redemptions_file_path = 'GovWallet/data/redemptions.csv'

# Example usage (staff_id_input should be provided by the user)
staff_id_input = '123' # Placeholder for user input
process_redemption(staff_id_input, staff_to_team_file_path, redemptions_file_path)
